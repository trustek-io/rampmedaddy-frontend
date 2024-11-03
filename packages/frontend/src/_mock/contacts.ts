export interface Contact {
  first_name: string
  last_name: string
  color: string
}

const getRandomColor = () => {
  const randomValue = () => Math.floor(Math.random() * 156 + 100) // Values between 100 and 255 for softer colors
  return `rgb(${randomValue()}, ${randomValue()}, ${randomValue()})`
}

const CONTACTS: Contact[] = [
  { "first_name": "John", "last_name": "Doe", "color": getRandomColor() },
  { "first_name": "Jane", "last_name": "Smith", "color": getRandomColor() },
  { "first_name": "Michael", "last_name": "Johnson", "color": getRandomColor() },
  { "first_name": "Emily", "last_name": "Davis", "color": getRandomColor() },
  { "first_name": "Robert", "last_name": "Brown", "color": getRandomColor() },
  { "first_name": "Linda", "last_name": "Wilson", "color": getRandomColor() },
  { "first_name": "James", "last_name": "Taylor", "color": getRandomColor() },
  { "first_name": "Patricia", "last_name": "Anderson", "color": getRandomColor() },
  { "first_name": "David", "last_name": "Thomas", "color": getRandomColor() },
  { "first_name": "Barbara", "last_name": "Jackson", "color": getRandomColor() },
  { "first_name": "Christopher", "last_name": "White", "color": getRandomColor() },
  { "first_name": "Susan", "last_name": "Harris", "color": getRandomColor() },
  { "first_name": "Daniel", "last_name": "Martin", "color": getRandomColor() },
  { "first_name": "Karen", "last_name": "Thompson", "color": getRandomColor() },
  { "first_name": "Matthew", "last_name": "Garcia", "color": getRandomColor() },
  { "first_name": "Nancy", "last_name": "Martinez", "color": getRandomColor() },
  { "first_name": "Joseph", "last_name": "Robinson", "color": getRandomColor() },
  { "first_name": "Lisa", "last_name": "Clark", "color": getRandomColor() },
  { "first_name": "Thomas", "last_name": "Rodriguez", "color": getRandomColor() },
  { "first_name": "Sarah", "last_name": "Lewis", "color": getRandomColor() }
]

export default CONTACTS
