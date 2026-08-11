const fs = require('fs');
const f = 'src/app/page.tsx';
let c = fs.readFileSync(f, 'utf-8').replace(/^\uFEFF/, '');

// Replace fake setTimeout submit with real API call
const oldSubmit = `setTimeout(() => {
      alert("\\u0417\\u0430\\u043A\\u0430\\u0437 \\u043E\\u0442\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D!");`;

const newSubmit = `fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          cart: cartItems,
        }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            alert("\\u0417\\u0430\\u043A\\u0430\\u0437 \\u043E\\u0442\\u043F\\u0440\\u0430\\u0432\\u043B\\u0435\\u043D!");
            setFormData({ name: '', phone: '', message: '' });
            setCartItems([]);
          } else {
            alert("\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u043E\\u0442\\u043F\\u0440\\u0430\\u0432\\u043A\\u0438");
          }
        })
        .catch(() => alert("\\u041E\\u0448\\u0438\\u0431\\u043A\\u0430 \\u0441\\u0435\\u0442\\u0438"));`;

if (!c.includes(oldSubmit)) {
  console.log('WARNING: fake submit pattern not found, trying alternate...');
  // Try to find the alert in the submit handler
  const altOld = /setTimeout\(\(\) => \{\s*alert\("/;
  if (altOld.test(c)) {
    c = c.replace(/setTimeout\(\(\) => \{\s*alert\("[^"]*"\);\s*(?:setFormData\([^)]*\);\s*)?(?:setCartItems\([^)]*\);\s*)?\}\s*,\s*\d+\)/, newSubmit.trim());
    console.log('OK: replaced with alternate pattern');
  } else {
    console.log('ERROR: Could not find submit pattern. Run this command to check:');
    console.log("Select-String -Path 'src/app/page.tsx' -Pattern 'setTimeout|alert' | Select-Object -First 5");
    process.exit(1);
  }
} else {
  c = c.replace(oldSubmit, newSubmit);
  console.log('OK: replaced fake submit with real API call');
}

fs.writeFileSync(f, c, 'utf-8');
