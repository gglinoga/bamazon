# bamazon

Bamazon is a CLI store front, utilizing a mySQL database to house product information.  The application employs the mysql package to create, read, and update the attached database.

In order to begin, the user must first install the require dependcies by running 'npm install' within the directory.

There are two points of entry, bamazonCustomer.js and bamazonManager.js, for customers and managers respectively.  The customer client allows the user to select and buy items at the desired quantity if there is enough available stock.  The manager client allows the following functions: view all inventory, view low inventory, add inventory, and add new item.