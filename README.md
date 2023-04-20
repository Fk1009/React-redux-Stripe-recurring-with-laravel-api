# How to install this app

## Frontend Installation

Clone the project from git repository

```bash
git clone project url
```
Let’s say the cloned folder name is ‘redux-workflow’
```bash
cd redux-workflow
```
So, run npm start on your terminal
```bash
npm start
```
## Backend Installation

Clone the project from git repository

```bash
git clone project(stripe-recurring-api) url
```
update or install composer
```bash
composer install
```
Install NPM Dependencies
```bash
npm install
```
Create a copy of your .env file
```bash
cp .env.example .env
```
Generate an app encryption key
```bash
php artisan key:generate
```
Create an empty database for your application or migrate if you dont want by below command
```bash
you can copy this file from root folder or import in database.
```
Skip this step if already import - 
Migrate the database
```bash
php artisan migrate
```


Let’s say the cloned folder name is ‘stripe-recurring-api’
```bash
cd stripe-recurring-api
```
So, run artisan serve on your other terminal
```bash
php artisan serve
```
## Introduction
This application includes the features with redux toolkit login, logout , signup and pricing plan with stripe recurring. you can choose one plan after choose, this plan redirect you to checkout page but before checkout you should have verified card after verification you can proceed to buy this plan using stripe recurring.

## Usage
After all this steps you can also import collection of your apis from root folder of stripe recurring api folder of backend.