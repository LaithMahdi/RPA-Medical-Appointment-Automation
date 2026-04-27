const testData = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@example.com',
  phone: '0123456789',
  dob: '1990-01-01',
  gender: 'Masculin',
  reason: 'Test de validation RPA via script'
};

fetch('http://localhost:5000/api/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(testData)
})
  .then(res => res.json())
  .then(data => {
    console.log('Success:', data);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
