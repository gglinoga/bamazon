var mysql = require('mysql');
var inquirer = require('inquirer');
var arr = [];

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId + "\n");
    afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            arr.push(res[i].product_name)
            console.log(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity);
        }
        askCustomer();
    });
};

function askCustomer() {
    inquirer.prompt([{
            name: 'itemToBuy',
            type: 'list',
            message: 'Which item would you like to purchase?',
            choices: arr
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like to buy?'
        }
    ]).then(function (answer) {
        var query = `SELECT * FROM products WHERE product_name = '${answer.itemToBuy}'`;
        connection.query(query, function (err, res) {
            if (err) throw err;
            if ((res[0].stock_quantity) > answer.quantity) {
                var query = connection.query(
                    'UPDATE products SET ? WHERE ?',
                    [{
                            stock_quantity: (res[0].stock_quantity - answer.quantity)
                        },
                        {
                            product_name: answer.itemToBuy
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log(`You have purchased ${answer.quantity} ${answer.itemToBuy}!\nYour order cost $${res[0].price*answer.quantity}`)
                    }
                )
                console.log(query.sql);
            } else {
                console.log('Insufficient quantity!');
            };
        });
    });
};