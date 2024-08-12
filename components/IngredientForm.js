import React, { useState, useEffect } from 'react';

const IngredientForm = ({ onAddIngredient, onClose, initialData = null }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');
  const [cost, setCost] = useState('');
  const [prepTime, setPrepTime] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAmount(initialData.amount);
      setUnit(initialData.unit);
      setCost(initialData.cost);
      setPrepTime(initialData.prepTime);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredient = { name, amount, unit, cost, prepTime };
    onAddIngredient(ingredient);
    onClose();
    setName('');
    setAmount('');
    setUnit('');
    setCost('');
    setPrepTime('');
    console.log("logged ingredient", ingredient);
    logDataServer();
  };

  const logDataServer = async () => {
    const response = await fetch('http://localhost:3001/ingredients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        amount: amount,
        unit: unit,
        cost: cost,
        prepTime: prepTime,
      }),
    });
    const data = await response.json();
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Unit"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Cost"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Prep Time (seconds)"
        value={prepTime}
        onChange={(e) => setPrepTime(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Add</button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 10,
  },
  input: {
    margin: 5,
    padding: 5,
    fontSize: 16,
  },
  button: {
    margin: 5,
    padding: 5,
    fontSize: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
};

export default IngredientForm;
