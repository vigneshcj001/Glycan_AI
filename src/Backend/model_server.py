from flask import Flask, request, jsonify
import torch

app = Flask(__name__)

# Load constant models
seq_model = torch.load('Seq_learner.pt')
glycoword_model = torch.load('glycoword_learner.pt')

# Model map for immunogenicity prediction
models = {
    'LSTM': torch.load('Immunogenic_classifier_LSTM.pt'),
    'GAT': torch.load('Immunogenic_classifier_GAT.pt'),
    'GIN': torch.load('Immunogenic_classifier_GIN.pt'),
    'MPNN': torch.load('Immunogenic_classifier_MPNN.pt')
}

# Inference functions
def infer(model, input_data):
    tensor_data = torch.tensor(input_data)  # Process data into tensor format if needed
    output = model(tensor_data)
    return output.tolist()

@app.route('/infer', methods=['POST'])
def infer_model():
    data = request.get_json()
    glycan_sequence = data['glycan_sequence']
    selected_model = data['model']

    # Step 1: Process with Seq_learner.pt
    seq_output = infer(seq_model, glycan_sequence)

    # Step 2: Process with glycoword_learner.pt
    glycoword_output = infer(glycoword_model, seq_output)

    # Step 3: Use selected immunogenicity model
    immunogenicity_model = models.get(selected_model)
    if immunogenicity_model is None:
        return jsonify({'error': 'Model not found'}), 400

    # Final Step: Predict immunogenicity
    result = infer(immunogenicity_model, glycoword_output)

    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
