var mysql = require("mysql2");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Walnut77",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;

    var query = connection.query(
        "SELECT * FROM products",
        function (err, data) {
            for (var i = 0; i < data.length; i++) {
                console.log("ID: " + data[i].id + " Department " + data[i].department + " Product: " + data[i].name + " $" + data[i].price + " In-Stock: " + data[i].stock);
            }
            inquirer.prompt([
                {
                    name: "itemId",
                    message: "Enter the ID of the product you would like to buy."
                },
                {
                    name: "quantity",
                    message: "How many would you like to buy?"
                }
            ]).then(function (answers) {
                var query = connection.query(
                    "SELECT * FROM products WHERE ?",
                    {
                        id: answers.itemId
                    },
                    function (err, data) {
                        if (answers.quantity > data[0].stock) {
                            console.log("Insufficient quantity! This product is on back order");
                            connection.end();
                        } else {
                            var query = connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        stock: data[0].stock - answers.quantity,
                                        sales: data[0].sales + (data[0].price * answers.quantity)
                                    },
                                    {
                                        id: answers.itemId
                                    }
                                ],
                                function (err, data) {
                                    console.log("Order placed was placed, the total price was $");
                                    connection.end();
                                    //Still need to show total amount paid
                                }
                            );
                        }
                    }
                );
            });
        }
    );
});