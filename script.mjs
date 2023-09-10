// const mongoose = require('mongoose');
import mongoose from 'mongoose';
// const url = 'mongodb+srv://mac:MACATHON123@grocerycatalogue.pxtqfsc.mongodb.net/?retryWrites=true&w=majority'
const url = 'mongodb+srv://mac:MACATHON123@grocerycatalogue.pxtqfsc.mongodb.net/catalog?retryWrites=true&w=majority'


// const express = require('express');
import express from 'express';
import open from 'open';
const app = express();
const port = process.env.PORT || 3000;

// Serve static files (e.g., index.html) from the "public" directory
app.use(express.static('public'));
app.use(express.json());

app.get('/voicerec.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(__dirname + '/public/voicerec.js');
});

app.post('/receive', (req, res) => {
  const data = req.body; // Data sent from voicerec.js
  console.log('Data received on the server:', data);
  // Process the data or perform actions as needed
  productSearch(data)
  res.sendStatus(200); // Send a response back to voicerec.js
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



mongoose.connect(url).
  catch(error => console.log("ERROR:", error));

// Defining product schema
const productSchema = new mongoose.Schema(
    {
        index: Number,
        Postal_code: Number,
    	Category: String,
        Sub_category: String,
        Product_Group: String,
        // Product_Name: {type: String, index: true},
        Product_Name: String,
        Package_price: Number,
        Price_per_unit: String,
        package_size: String,
        is_estimated: Number,
        is_special: Number,
        // in_stock
        // Retail_price
        Product_Url: String,
        Brand: String,
        Sku: String,
        RunDate: String,
        unit_price: Number,
        unit_price_unit: String,
        state: String,
        city: String,
        tid: Number
    }
)
  
// Defining product model


const Product = mongoose.model('Product', productSchema, 'vic_catalog_nodupe');

async function searchProductsBySubstring(substring) {
    try {
      const products = await Product.aggregate([
        {
          $search: {
            index: "nodupecatalog",
            text: {
              query: substring, // Your search substring
              path: {
                wildcard: "*"
              }, // Replace with the actual field name you want to search in
            },
          },
        },
      ]);
  
      return products;
    } catch (err) {
      console.error('Error searching for products:', err);
      throw err;
    }
}


async function productSearch(productList) {
  for (let i = 0; i < productList.length; i++) {
      const products = searchProductsBySubstring(productList[i])
      .then((matchingProducts) => {
        console.log('Matching products NON REG:', matchingProducts[0]);
        const url = matchingProducts[0].Product_Url;
        open(url);
        open("https://www.coles.com.au/search?q=" + productList[i]);
    })
      .catch((err) => {
        console.error('Error:', err);
    })
  }
}






