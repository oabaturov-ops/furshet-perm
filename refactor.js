const fs = require('fs');
const f = 'src/app/page.tsx';
let c = fs.readFileSync(f, 'utf-8').replace(/^\uFEFF/, '');

// 1) Remove hardcoded menuCategories block
c = c.replace(/const menuCategories\s*=\s*\[[\s\S]*?\];/, '');

// 2) Inject fetch inside MenuSection - find the function and add state+useEffect
const oldFn = 'function MenuSection() {';
const newFn = `function MenuSection() {
  const [menuCategories, setMenuCategories] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(data => {
        setMenuCategories(data.map(cat => ({
          name: cat.name,
          items: cat.dishes.map(d => ({
            name: d.name,
            desc: d.description,
            price: d.price + ' \\u20BD'
          }))
        })));
        setMenuLoading(false);
      })
      .catch(() => setMenuLoading(false));
  }, []);

  if (menuLoading) {
    return <div style={{ textAlign: 'center', padding: 80, color: '#888' }}>\\u0417\\u0430\\u0433\\u0440\\u0443\\u0437\\u043A\\u0430 \\u043C\\u0435\\u043D\\u044E...</div>;
  }`;

if (!c.includes(oldFn)) { console.log('ERROR: MenuSection() not found!'); process.exit(1); }
c = c.replace(oldFn, newFn);

fs.writeFileSync(f, c, 'utf-8');
console.log('OK: menuCategories replaced with fetch from /api/menu');
