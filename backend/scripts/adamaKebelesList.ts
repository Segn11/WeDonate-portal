// Comprehensive list of kebeles in Adama City, Ethiopia
// This is the standard administrative division of Adama City

const ADAMA_KEBELES = [
  { code: '01', name: 'Kebele 01' },
  { code: '02', name: 'Kebele 02' },
  { code: '03', name: 'Kebele 03' },
  { code: '04', name: 'Kebele 04' },
  { code: '05', name: 'Kebele 05 (Bole)' },
  { code: '06', name: 'Kebele 06' },
  { code: '07', name: 'Kebele 07' },
  { code: '08', name: 'Kebele 08 (Demdela)' },
  { code: '09', name: 'Kebele 09' },
  { code: '10', name: 'Kebele 10' },
  { code: '11', name: 'Kebele 11' },
  { code: '12', name: 'Kebele 12' },
  { code: '13', name: 'Kebele 13' },
  { code: '14', name: 'Kebele 14' },
  { code: '15', name: 'Kebele 15' },
  { code: '16', name: 'Kebele 16' },
  { code: '17', name: 'Kebele 17' },
  { code: '18', name: 'Kebele 18' },
];

console.log('Adama City Kebeles List:');
console.log('========================\n');

ADAMA_KEBELES.forEach((kebele, index) => {
  console.log(`${index + 1}. ${kebele.name} (Code: ${kebele.code})`);
});

console.log(`\nTotal: ${ADAMA_KEBELES.length} kebeles`);

export { ADAMA_KEBELES };
