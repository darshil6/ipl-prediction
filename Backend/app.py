from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import traceback
import mysql.connector
from mysql.connector import pooling

# ─────────────────────────────────────────────
# App setup
# ─────────────────────────────────────────────
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# ML Model (from app.py / Flask)
# ─────────────────────────────────────────────
def load_model_components():
    base_path = r'./model_components'

    with open(f'{base_path}\\xgb_model.pkl', 'rb') as f:
        model = pickle.load(f)

    with open(f'{base_path}\\label_encoders.pkl', 'rb') as f:
        encoders = pickle.load(f)

    return model, encoders

model, encoders = load_model_components()

class PredictRequest(BaseModel):
    team1: str
    team2: str
    venue: str
    toss_winner: str
    toss_decision: str

@app.post("/predict")
def predict(data: PredictRequest):
    try:
        print("Received request data:", data)

        pred_data = pd.DataFrame([[
            data.team1,
            data.team2,
            data.venue,
            data.toss_winner,
            data.toss_decision.lower()
        ]], columns=['team1', 'team2', 'venue', 'toss_winner', 'toss_decision'])

        for column in pred_data.columns:
            if column in encoders:
                pred_data[column] = encoders[column].transform(pred_data[column])

        print("Encoded data:", pred_data)

        prediction = model.predict(pred_data)[0]
        probabilities = model.predict_proba(pred_data)[0]

        predicted_winner = encoders['winner'].inverse_transform([prediction])[0]
        win_probability = float(probabilities[prediction] * 100)

        response = {
            'predicted_winner': predicted_winner,
            'win_probability': round(win_probability, 2)
        }

        print("Sending response:", response)
        return response

    except Exception as e:
        print("Error occurred:", str(e))
        print("Traceback:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# MySQL Connection Pool (from server.js / Express)
# ─────────────────────────────────────────────
db_pool = pooling.MySQLConnectionPool(
    pool_name="ipl_pool",
    pool_size=10,
    host="localhost",
    port=3306,
    user="root",
    password="root",
    database="ipl"
)

def query_db(sql: str, params: tuple = ()):
    conn = db_pool.get_connection()
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute(sql, params)
        results = cursor.fetchall()
        return results
    finally:
        cursor.close()
        conn.close()


# ─────────────────────────────────────────────
# MySQL API Endpoints (from server.js / Express)
# ─────────────────────────────────────────────

@app.get("/api/data/{team}")
def get_data(team: str):
    query = """SELECT toss_decision, COUNT(*) as count 
               FROM matches 
               WHERE toss_winner = %s 
               GROUP BY toss_decision 
               ORDER BY count DESC"""
    try:
        return query_db(query, (team,))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/average_runs/{team}")
def get_average_runs(team: str):
    query = """
        WITH selected_team AS (
            SELECT *
            FROM deliveries
            WHERE TRIM(batting_team) = %s
        ),
        innings_data AS (
            SELECT 
                match_id,
                inning,
                bowling_team,
                SUM(total_runs) as total_runs
            FROM selected_team
            GROUP BY match_id, inning, bowling_team
        )
        SELECT 
            bowling_team,
            ROUND(AVG(total_runs)) as total_runs
        FROM innings_data
        GROUP BY bowling_team
        ORDER BY AVG(total_runs) DESC
    """
    try:
        return query_db(query, (team,))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/over_score/{team}")
def get_over_score(team: str):
    query = """
        WITH RECURSIVE all_overs AS (
            SELECT 0 as over_num
            UNION ALL
            SELECT over_num + 1
            FROM all_overs
            WHERE over_num < 19
        )
        SELECT 
            a.over_num as `over`,
            COALESCE(ROUND(AVG(d.total_runs) * 6), 0) as total_runs
        FROM all_overs a
        LEFT JOIN deliveries d ON a.over_num = d.over_ 
            AND TRIM(d.batting_team) = %s
        GROUP BY a.over_num
        ORDER BY a.over_num
    """
    try:
        results = query_db(query, (team,))
        if not results:
            raise HTTPException(status_code=404, detail="No data found for this team")
        return results
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/venue_wise_win/{team}")
def get_venue_wise_win(team: str):
    query = """
        SELECT 
            venue,
            COUNT(*) as win_count
        FROM matches
        WHERE TRIM(winner) = %s
        GROUP BY venue
        ORDER BY win_count DESC
        LIMIT 10
    """
    try:
        results = query_db(query, (team,))
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/high_scores/{team}")
def get_high_scores(team: str):
    query = """
        SELECT 
            match_id,
            bowling_team,
            inning,
            SUM(total_runs) as total_runs,
            CONCAT(match_id, '_', bowling_team) as data
        FROM deliveries
        WHERE TRIM(batting_team) = %s
        GROUP BY match_id, bowling_team, inning
        HAVING SUM(total_runs) > 200
        ORDER BY total_runs DESC
    """
    try:
        results = query_db(query, (team,))
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/lowest_scores/{team}")
def get_lowest_scores(team: str):
    query = """
        SELECT 
            match_id,
            bowling_team,
            inning,
            SUM(total_runs) as total_runs,
            CONCAT(match_id, '_', bowling_team) as data
        FROM deliveries
        WHERE TRIM(batting_team) = %s
            AND inning < 3
        GROUP BY match_id, bowling_team, inning
        ORDER BY total_runs ASC
        LIMIT 10
    """
    try:
        results = query_db(query, (team,))
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/player_runs/{player}")
def get_player_runs(player: str):
    query = """
        SELECT 
            bowling_team,
            SUM(total_runs) as total_runs
        FROM deliveries
        WHERE TRIM(batter) = %s
        GROUP BY bowling_team
        ORDER BY total_runs DESC
    """
    try:
        results = query_db(query, (player,))
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/player_vs_bowler/{player}")
def get_player_vs_bowler(player: str):
    query = """
        SELECT 
            bowler,
            SUM(total_runs) as total_runs
        FROM deliveries
        WHERE TRIM(batter) = %s
        GROUP BY bowler
        ORDER BY total_runs DESC
        LIMIT 15
    """
    try:
        results = query_db(query, (player,))
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/all_players")
def get_all_players():
    query = """
        SELECT DISTINCT player_name
        FROM (
            SELECT DISTINCT batter as player_name FROM deliveries
            UNION
            SELECT DISTINCT bowler as player_name FROM deliveries
        ) as players
        ORDER BY player_name
    """
    try:
        results = query_db(query)
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/player_partnerships/{player}")
def get_player_partnerships(player: str):
    query = """
       SELECT
         non_striker,
                     SUM(total_runs) as total_runs
                 FROM deliveries
                 WHERE batter= %s
                 GROUP BY non_striker
                 ORDER BY total_runs DESC
                 LIMIT 15;
    """
    try:
        results = query_db(query, (player,))
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/player_innings_runs/{player}")
def get_player_innings_runs(player: str):
    query = """
        SELECT 
            inning,
            SUM(total_runs) as total_runs
        FROM deliveries
        WHERE TRIM(batter) = %s
            AND inning < 3
        GROUP BY inning
        ORDER BY inning
    """
    try:
        results = query_db(query, (player,))
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/player_bowling_stats/{player}")
def get_player_bowling_stats(player: str):
    query = """
        SELECT 
            batter,
            SUM(total_runs) as total_runs
        FROM deliveries
        WHERE TRIM(bowler) = %s
        GROUP BY batter
        ORDER BY total_runs DESC
        LIMIT 15
    """
    try:
        results = query_db(query, (player,))
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/player_bowling_overs/{player}")
def get_player_bowling_overs(player: str):
    query = """
        SELECT 
            over_ as over_number,
            SUM(total_runs) as total_runs
        FROM deliveries
        WHERE TRIM(bowler) = %s
        GROUP BY over_number
        ORDER BY over_number ASC;
    """
    try:
        results = query_db(query, (player,))
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/player_over_count/{player}")
def get_player_over_count(player: str):
    query = """
        SELECT 
            over_ as over_number,
            ROUND(COUNT(*) / 6, 2) as over_count
        FROM deliveries
        WHERE TRIM(bowler) = %s
        GROUP BY over_number
        ORDER BY over_number ASC
    """
    try:
        results = query_db(query, (player,))
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/bowler_vs_teams/{player}")
def get_bowler_vs_teams(player: str):
    query = """
        SELECT 
            batting_team,
            SUM(total_runs) as total_runs
        FROM deliveries
        WHERE TRIM(bowler) = %s
        GROUP BY batting_team
        ORDER BY total_runs DESC
        LIMIT 15
    """
    try:
        results = query_db(query, (player,))
        return results if results else []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/team_head_to_head/{team1}/{team2}")
def get_team_head_to_head(team1: str, team2: str):
    if team1 == team2:
        raise HTTPException(status_code=400, detail="Oops! Looks Like Team1 and Team2 Are Same")

    query = """
        SELECT 
            COUNT(*) as total_matches,
            SUM(CASE WHEN winner = %s THEN 1 ELSE 0 END) as team1_wins,
            SUM(CASE WHEN winner = %s THEN 1 ELSE 0 END) as team2_wins
        FROM matches 
        WHERE (team1 = %s AND team2 = %s) 
           OR (team1 = %s AND team2 = %s)"""
    try:
        results = query_db(query, (team1, team2, team1, team2, team2, team1))
        r = results[0]
        return {
            "totalMatches": r["total_matches"],
            "team1Wins": r["team1_wins"],
            "team2Wins": r["team2_wins"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/team_head_to_head_toss/{team1}/{team2}")
def get_team_head_to_head_toss(team1: str, team2: str):
    if team1 == team2:
        raise HTTPException(status_code=400, detail="Oops! Looks Like Team1 and Team2 Are Same")

    query = """
        SELECT 
            COUNT(*) as total_matches,
            SUM(CASE WHEN toss_winner = %s THEN 1 ELSE 0 END) as team1_toss_wins,
            SUM(CASE WHEN toss_winner = %s THEN 1 ELSE 0 END) as team2_toss_wins
        FROM matches 
        WHERE (team1 = %s AND team2 = %s) 
           OR (team1 = %s AND team2 = %s)"""
    try:
        results = query_db(query, (team1, team2, team1, team2, team2, team1))
        r = results[0]
        return {
            "totalMatches": r["total_matches"],
            "team1Wins": r.get("team1_wins"),
            "team2Wins": r.get("team2_wins"),
            "team1TossWins": r["team1_toss_wins"],
            "team2TossWins": r["team2_toss_wins"]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/team_season_runs/{team1}/{team2}")
def get_team_season_runs(team1: str, team2: str):
    query = """
        WITH TeamRuns AS (
            SELECT 
                m.season,
                m.id,
                d.inning,
                d.batting_team,
                SUM(d.total_runs) as total_runs
            FROM deliveries d
            JOIN matches m ON d.match_id = m.id
            WHERE (d.batting_team = %s OR d.batting_team = %s)
                AND d.inning < 3
                AND ((m.team1 = %s AND m.team2 = %s) OR (m.team1 = %s AND m.team2 = %s))
            GROUP BY m.season, m.id, d.inning, d.batting_team
        )
        SELECT 
            season,
            batting_team,
            ROUND(AVG(total_runs), 2) as average_runs
        FROM TeamRuns
        GROUP BY season, batting_team
        ORDER BY season ASC, batting_team"""
    try:
        return query_db(query, (team1, team2, team1, team2, team2, team1))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/city_wise_wins/{team1}/{team2}")
def get_city_wise_wins(team1: str, team2: str):
    query = """
        SELECT 
            city,
            SUM(CASE WHEN winner = %s THEN 1 ELSE 0 END) as team1_wins,
            SUM(CASE WHEN winner = %s THEN 1 ELSE 0 END) as team2_wins
        FROM matches 
        WHERE ((team1 = %s AND team2 = %s) OR (team1 = %s AND team2 = %s))
            AND winner IS NOT NULL
        GROUP BY city
        HAVING team1_wins > 0 OR team2_wins > 0
        ORDER BY (team1_wins + team2_wins) DESC"""
    try:
        return query_db(query, (team1, team2, team1, team2, team2, team1))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/team_head_to_head_stats/{team1}/{team2}")
def get_team_head_to_head_stats(team1: str, team2: str):
    query = """
        SELECT 
            SUM(CASE WHEN bowling_team = %s THEN extra_runs ELSE 0 END) as team1_extras,
            SUM(CASE WHEN bowling_team = %s THEN extra_runs ELSE 0 END) as team2_extras,
            SUM(CASE WHEN batting_team = %s AND total_runs = 6 THEN 1 ELSE 0 END) as team1_sixes,
            SUM(CASE WHEN batting_team = %s AND total_runs = 6 THEN 1 ELSE 0 END) as team2_sixes,
            SUM(CASE WHEN batting_team = %s AND total_runs = 4 THEN 1 ELSE 0 END) as team1_fours,
            SUM(CASE WHEN batting_team = %s AND total_runs = 4 THEN 1 ELSE 0 END) as team2_fours,
            SUM(CASE WHEN batting_team = %s AND total_runs = 2 THEN 1 ELSE 0 END) as team1_doubles,
            SUM(CASE WHEN batting_team = %s AND total_runs = 2 THEN 1 ELSE 0 END) as team2_doubles,
            SUM(CASE WHEN batting_team = %s AND total_runs = 1 THEN 1 ELSE 0 END) as team1_singles,
            SUM(CASE WHEN batting_team = %s AND total_runs = 1 THEN 1 ELSE 0 END) as team2_singles,
            SUM(CASE WHEN batting_team = %s THEN total_runs ELSE 0 END) as team1_total_runs,
            SUM(CASE WHEN batting_team = %s THEN total_runs ELSE 0 END) as team2_total_runs
        FROM deliveries d
        JOIN matches m ON d.match_id = m.id
        WHERE (m.team1 = %s AND m.team2 = %s) OR (m.team1 = %s AND m.team2 = %s)"""
    try:
        results = query_db(query, (team1, team2, team1, team2, team1, team2, team1, team2, team1, team2, team1, team2, team1, team2, team2, team1))
        return results[0] if results else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/team_sixes_batters/{team1}/{team2}")
def get_team_sixes_batters(team1: str, team2: str):
    query = """
SELECT 
    batter,
    COUNT(*) as sixes_count
FROM deliveries
WHERE batting_team = %s
    AND total_runs = 6
    AND bowling_team = %s
GROUP BY batter
ORDER BY sixes_count DESC LIMIT 10"""
    try:
        return query_db(query, (team1, team2))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/team1_sixes_batters/{team1}/{team2}")
def get_team1_sixes_batters(team1: str, team2: str):
    query = """
SELECT 
    batter,
    COUNT(*) as sixes_count
FROM deliveries
WHERE batting_team = %s
    AND total_runs = 6
    AND bowling_team = %s
GROUP BY batter
ORDER BY sixes_count DESC LIMIT 10"""
    try:
        return query_db(query, (team1, team2))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/team_fours_batters/{team1}/{team2}")
def get_team_fours_batters(team1: str, team2: str):
    query = """
        SELECT 
            batter,
            COUNT(*) as fours_count
        FROM deliveries
        WHERE batting_team = %s
            AND total_runs = 4
            AND bowling_team = %s
        GROUP BY batter
        ORDER BY fours_count DESC 
        LIMIT 10"""
    try:
        return query_db(query, (team1, team2))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/team1_fours_batters/{team1}/{team2}")
def get_team1_fours_batters(team1: str, team2: str):
    query = """
        SELECT 
            batter,
            COUNT(*) as fours_count
        FROM deliveries
        WHERE batting_team = %s
            AND total_runs = 4
            AND bowling_team = %s
        GROUP BY batter
        ORDER BY fours_count DESC 
        LIMIT 10"""
    try:
        return query_db(query, (team2, team1))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/batter-vs-bowler")
def get_batter_vs_bowler(batter: str = Query(...), bowler: str = Query(...)):
    query = """
    SELECT 
      match_id,
      batting_team,
      bowling_team,
      over_,
      ball,
      batter,
      bowler,
      total_runs    
    FROM deliveries
    WHERE batter = %s AND bowler = %s
    ORDER BY match_id, over_, ball"""
    try:
        return query_db(query, (batter, bowler))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/batter-vs-bowler-stats")
def get_batter_vs_bowler_stats(batter: str = Query(...), bowler: str = Query(...)):
    query = """
    SELECT 
      COUNT(*) as total_balls_bowled,
      SUM(total_runs) as total_runs,
      SUM(CASE WHEN total_runs = 6 THEN 1 ELSE 0 END) as sixes,
      SUM(CASE WHEN total_runs = 4 THEN 1 ELSE 0 END) as fours,
      SUM(CASE WHEN total_runs = 0 THEN 1 ELSE 0 END) as dot_balls,
      SUM(CASE WHEN extras_type = 'wides' THEN 1 ELSE 0 END) as wide_balls,
      SUM(CASE WHEN extras_type = 'legbyes' THEN 1 ELSE 0 END) as leg_byes,
      SUM(CASE WHEN extras_type = 'byes' THEN 1 ELSE 0 END) as byes,
      SUM(CASE WHEN extras_type = 'noballs' THEN 1 ELSE 0 END) as no_balls,
      SUM(CASE WHEN extras_type = 'penalty' THEN 1 ELSE 0 END) as penalties
    FROM deliveries
    WHERE batter = %s AND bowler = %s"""
    try:
        results = query_db(query, (batter, bowler))
        return results[0] if results else {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/batter-vs-bowler-summary")
def get_batter_vs_bowler_summary(batter: str = Query(...), bowler: str = Query(...)):
    query = """
      SELECT 
        'Total Balls Bowled' as statistic, COUNT(*) as value
      FROM deliveries 
      WHERE batter = %s AND bowler = %s
      UNION ALL
      SELECT 'Total Runs', SUM(total_runs)
      FROM deliveries 
      WHERE batter = %s AND bowler = %s
      UNION ALL
      SELECT 'Sixes', SUM(CASE WHEN total_runs = 6 THEN 1 ELSE 0 END)
      FROM deliveries 
      WHERE batter = %s AND bowler = %s
      UNION ALL
      SELECT 'Fours', SUM(CASE WHEN total_runs = 4 THEN 1 ELSE 0 END)
      FROM deliveries 
      WHERE batter = %s AND bowler = %s
      UNION ALL
      SELECT 'Dot Balls', SUM(CASE WHEN total_runs = 0 THEN 1 ELSE 0 END)
      FROM deliveries 
      WHERE batter = %s AND bowler = %s
      UNION ALL
      SELECT 'Wide Balls', SUM(CASE WHEN extras_type = 'wides' THEN 1 ELSE 0 END)
      FROM deliveries 
      WHERE batter = %s AND bowler = %s
      UNION ALL
      SELECT 'Leg Byes', SUM(CASE WHEN extras_type = 'legbyes' THEN 1 ELSE 0 END)
      FROM deliveries 
      WHERE batter = %s AND bowler = %s
      UNION ALL
      SELECT 'Byes', SUM(CASE WHEN extras_type = 'byes' THEN 1 ELSE 0 END)
      FROM deliveries 
      WHERE batter = %s AND bowler = %s
      UNION ALL
      SELECT 'No Balls', SUM(CASE WHEN extras_type = 'noballs' THEN 1 ELSE 0 END)
      FROM deliveries 
      WHERE batter = %s AND bowler = %s
      UNION ALL
      SELECT 'Penalties', SUM(CASE WHEN extras_type = 'penalty' THEN 1 ELSE 0 END)
      FROM deliveries 
      WHERE batter = %s AND bowler = %s"""
    params = (
        batter, bowler, batter, bowler, batter, bowler,
        batter, bowler, batter, bowler, batter, bowler,
        batter, bowler, batter, bowler, batter, bowler,
        batter, bowler
    )
    try:
        return query_db(query, params)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ─────────────────────────────────────────────
# Run server
# ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)