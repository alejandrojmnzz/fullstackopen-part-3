
// const name = process.argv[3]
// const number = process.argv[4]

// if (!name && !number) {
//     Person.find({}).then(result => {
//         console.log('phonebook:')
//         result.forEach(person => {
//             console.log(person.name, person.number)
//         })
//         mongoose.connection.close()
//     })
// }

// const person = new Person(  {
//     name: name,
//     number: number
// })


if (person.name) {
    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
})
}
