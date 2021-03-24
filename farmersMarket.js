const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const options = {
    'CH1': { name: 'Chai', price: 3.11 },
    'AP1': { name: 'Apples', price: 6.00 },
    'CF1': { name: 'Coffee', price: 11.23 },
    'MK1': { name: 'Milk', price: 4.75 },
    'OM1': { name: 'Oatmeal', price: 3.69 }
}

const discounts = {
    'BOGO': 'Buy-One-Get-One-Free Special on Coffee. (Unlimited)',
    'APPL': 'If you buy 3 or more bags of Apples, the price drops to $4.50',
    'CHMK': 'Purchase a box of Chai and get milk free. (Limit 1)',
    'APOM': 'Purchase a bag of Oatmeal and get 50% off a bag of Apples'
}

let bag = {}

function applyDiscounts () {
    const appliedDiscounts = {}
    if (bag.AP1?.quantity >= 3) {
        const value = -1 * (options.AP1.price - 4.50)
        const quantity = bag.AP1.quantity
        appliedDiscounts.APPL = { quantity, value }
    }
    if (bag.CF1?.quantity >= 2) {
        const quantity = Math.floor(bag.CF1.quantity / 2)
        const value = -1 * options.CF1.price
        appliedDiscounts.BOGO = { quantity, value }
    }
    if (bag.CH1?.quantity && bag.MK1?.quantity) {
        const value =  -1 * options.MK1.price
        appliedDiscounts.CHMK = { quantity: 1, value }
    }
    if (bag.OM1?.quantity && bag.AP1?.quantity) {
        const quantity = Math.min(bag.OM1.quantity, bag.AP1.quantity)
        const value = (bag.AP1.price / 2)
        appliedDiscounts.APOM = { quantity, value }
    }
    return appliedDiscounts
}

function printMenu () {
    console.log('Options')
    console.table(options)
    console.log('Discounts')
    console.table(discounts)
}

function printReceipt () {
    const items = { ...bag, ...applyDiscounts() }
    let totalPrice = 0.00
    for (const item in items) {
        const row = {...items[item]}
        row.totalValue = row.value * row.quantity
        totalPrice += row.totalValue
        row.totalValue = row.totalValue.toFixed(2)
        row.value = row.value.toFixed(2)
        row.type = options[item] ? 'produce' : 'discount'
        items[item] = row
    }
    console.table(items)
    console.log(`Total: ${totalPrice.toFixed(2)}`)
}

rl.on('line', (input) => {
    if (input === 'checkout') {
        printReceipt()
        rl.close()
    } else if (input === 'menu') {
        printMenu()
    } else if (input === 'bag') {
        printReceipt()
    } else if (input === 'clear') {
        bag = {}
    } else if (options[input]) {
        if (bag[input]) {
            bag[input].quantity += 1
        } else {
            bag[input] = { quantity: 1, value: options[input].price }
        }
    } else {
        console.log('Invalid input')
    }
})

rl.on("close", function() {
    console.log("The program is ending.");
    console.log("Thank you for shopping with us!");
    process.exit(0);
})
