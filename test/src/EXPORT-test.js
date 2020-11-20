const fii = require('../../')
const test = require('tape')

const sandbox = 'test/sandbox/'
const exportingIndexName = sandbox + 'EXPORT'
const importingIndexName = sandbox + 'IMPORT'

const exportedIndexIdeal = [
  { key: 'colour:Black', value: [ '1' ] },
  { key: 'colour:Blue', value: [ '0' ] },
  { key: 'drivetrain:Hybrid', value: [ '0' ] },
  { key: 'drivetrain:Petrol', value: [ '1' ] },
  { key: 'make:BMW', value: [ '0' ] },
  { key: 'make:Volvo', value: [ '1' ] },
  { key: 'model:3-series', value: [ '0' ] },
  { key: 'model:XC90', value: [ '1' ] },
  { key: 'price:44274', value: [ '1' ] },
  { key: 'price:83988', value: [ '0' ] },
  { key: 'year:2011', value: [ '0' ] },
  { key: 'year:2016', value: [ '1' ] },
  {
    key: '￮DOC￮0￮',
    value: {
      _id: '0',
      make: 'BMW',
      colour: 'Blue',
      year: 2011,
      price: 83988,
      model: '3-series',
      drivetrain: 'Hybrid'
    }
  },
  {
    key: '￮DOC￮1￮',
    value: {
      _id: '1',
      make: 'Volvo',
      colour: 'Black',
      year: 2016,
      price: 44274,
      model: 'XC90',
      drivetrain: 'Petrol'
    }
  },
  { key: '￮FIELD￮colour￮', value: 'colour' },
  { key: '￮FIELD￮drivetrain￮', value: 'drivetrain' },
  { key: '￮FIELD￮make￮', value: 'make' },   
  { key: '￮FIELD￮model￮', value: 'model' }, 
  { key: '￮FIELD￮price￮', value: 'price' }, 
  { key: '￮FIELD￮year￮', value: 'year' }
]


var exportedIndex = null

const data = [
  {
    "_id": 0,
    "make": "BMW",
    "colour": "Blue",
    "year": 2011,
    "price": 83988,
    "model": "3-series",
    "drivetrain": "Hybrid"
  },
  {
    "_id": 1,
    "make": "Volvo",
    "colour": "Black",
    "year": 2016,
    "price": 44274,
    "model": "XC90",
    "drivetrain": "Petrol"
  }
]

test('create an index for export', t => {
  t.plan(1)
  fii({ name: exportingIndexName }).then(db => {
    global[exportingIndexName] = db    
    t.ok(db, !undefined)
  })
})

test('can add some data', t => {
  t.plan(1)
  global[exportingIndexName].PUT(data).then(t.pass)
})

test('can export some data', t => {  
  t.plan(1)
  global[exportingIndexName].EXPORT()
    .then(exported => {
      t.deepEqual(exported, exportedIndexIdeal)
      exportedIndex = exported
    })
})

test('create an index for export', t => {
  t.plan(1)
  fii({ name: importingIndexName }).then(db => {
    global[importingIndexName] = db    
    t.ok(db, !undefined)
  })
})

test('added data will be overwritten by the import', t => {
  t.plan(1)
  global[importingIndexName].PUT([{
    id: '99',
    text: 'this document will be overwritten by the import'
  }]).then(t.pass)
})

test('can IMPORT some data', t => {
  t.plan(1)
  global[importingIndexName]
    .IMPORT(exportedIndex)
    .then(() => t.ok('imported'))
})

test('can export previously imported data. Index looks ok', t => {  
  t.plan(1)
  global[importingIndexName].EXPORT()
    .then(exported => {
      t.deepEqual(exported, exportedIndexIdeal)
      exportedIndex = exported
    })
})
