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
    connection.query('SELECT * FROM products', function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            arr.push(res[i].product_name)
        }
    })
    mainMenu();
});

function mainMenu() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Select an option:",
            choices: [
                "View Products for Sale",
                "View Low Inventory",
                "Add to Inventory",
                "Add New Product",
                "Exit"
            ]
        }).then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewAllProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addNewProduct();
                    break;

                case "Exit":
                    console.log("Good-bye!");
                    connection.end();
            }
        })
}

function viewAllProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log('\n');
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity);
        }
        mainMenu();
    });
};

function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.log('\n');
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity);
        }
        mainMenu();
    });
};

function addToInventory() {
    inquirer
        .prompt([{
            name: "product",
            type: "list",
            message: "Select item to add:",
            choices: arr
        }, {
            name: "quantity",
            type: "input",
            message: "How many to add?"
        }]).then(function (answer) {
            var query = `SELECT * FROM products WHERE product_name = '${answer.product}'`;
            connection.query(query, function (err, res) {
                if (err) throw err;
                var query = connection.query(
                    `UPDATE products SET ? WHERE ?`,
                    [{
                            stock_quantity: (parseInt(res[0].stock_quantity) + parseInt(answer.quantity))
                        },
                        {
                            product_name: answer.product
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log(`You have added ${answer.quantity} ${answer.product}!`);
                    });
                console.log(query.sql);
                mainMenu();
            });
        });
};

function addNewProduct() {
    inquirer
        .prompt([{
            name: 'product',
            type: 'input',
            message: 'Enter name of product:'
        }, {
            name: 'department',
            type: 'input',
            message: 'Enter department of product:'
        }, {
            name: 'price',
            type: 'input',
            message: 'Enter price of product:'
        }, {
            name: 'quantity',
            type: 'input',
            message: 'Enter quantity of product:'
        }]).then(function (answer) {
            var query = connection.query(
                'INSERT INTO products SET ?', {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                }
            )
            console.log(query.sql);
            mainMenu();
        })
};