import pickle
import pandas as pd

def load_model_components():
    base_path = 'c:\\Users\\praja\\OneDrive\\Desktop\\IPL predection\\model_components'
    
    # Load XGBoost model
    with open(f'{base_path}\\xgb_model.pkl', 'rb') as f:
        model = pickle.load(f)
    
    # Load label encoders
    with open(f'{base_path}\\label_encoders.pkl', 'rb') as f:
        encoders = pickle.load(f)
    
    return model, encoders

def make_prediction():
    print("\nIPL Match Winner Prediction")
    print("-" * 30)
    
    # Load model and encoders
    try:
        model, encoders = load_model_components()
    except FileNotFoundError:
        print("Error: Model files not found. Please ensure the model is trained first.")
        return
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return

    # Get input from user
    team1 = input("Enter team 1: ")
    team2 = input("Enter team 2: ")
    venue = input("Enter venue: ")
    toss_winner = input("Enter toss winner: ")
    toss_decision = input("Enter toss decision (bat/field): ")

    try:
        # Create prediction data
        pred_data = pd.DataFrame([[
            team1, team2, venue, toss_winner, toss_decision,
            # 2024, 4, 0.5, 0.5, 0.5, 0.5
        ]], columns=[
            'team1', 'team2', 'venue', 'toss_winner', 'toss_decision'
            # 'year', 'month', 'team1_win_rate', 'team2_win_rate',
            # 'team1_venue_rate', 'team2_venue_rate'
        ])
        
        # Encode categorical variables
        for column in ['team1', 'team2', 'venue', 'toss_winner', 'toss_decision']:
            pred_data[column] = encoders[column].transform([pred_data[column].iloc[0]])
        
        # Make prediction
        prediction = model.predict(pred_data)[0]
        probabilities = model.predict_proba(pred_data)[0]
        
        # Get predicted winner name
        predicted_winner = encoders['winner'].inverse_transform([prediction])[0]
        win_probability = probabilities[prediction] * 100

        # Display results
        print("\nPrediction Results:")
        print("-" * 30)
        print(f"Match: {team1} vs {team2}")
        print(f"Venue: {venue}")
        print(f"Toss: {toss_winner} chose to {toss_decision}")
        print(f"Predicted Winner: {predicted_winner}")
        print(f"Win Probability: {win_probability:.2f}%")
        
    except KeyError:
        print("Error: Invalid input. Please check team names and venue.")
    except Exception as e:
        print(f"Error making prediction: {str(e)}")
        print("Please check your input values and try again.")

if __name__ == "__main__":
    while True:
        make_prediction()
        if input("\nMake another prediction? (y/n): ").lower() != 'y':
            break