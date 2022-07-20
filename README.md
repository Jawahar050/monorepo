# monorepo
React Application + monorepo typeorm, fastify, type-graphql and Apollo server, docker-compose or Kubernetes or helm

# Create a monorepo (recommended nrwl)

# Core monorepo setup

# Create new empty foldermkdir monorepodemo
    cd monorepo
# Create subdirectories
    mkdir src

# Next, create a ./package.json with the following content:

    package.json

    {
        "name": "monorepo",
        "private": true,
        "scripts": {
            "compile": "tsc -b -w -i",
            "eslint": "eslint src/**/**.{ts,tsx}",
            "eslint:fix": "eslint src/**/**.{ts,tsx} --fix"
        },
        "devDependencies": {},
        "workspaces": [
            "packages/*"
        ]
    }

# Add core dependencies

  A great place to add core dependencies is here. This also creates the single node_modules directory needed in the entire monorepo.

    npm install @types/node --save-dev
    npm install typescript
    npm install ts-node --save-dev

# Next, create a ./tsconfig.json with the following content.

    {
    "compilerOptions": {
        "incremental": true,
        "target": "es2019",
        "module": "commonjs",
        "declaration": true,
        "sourceMap": true,
        "strict": true,
        "moduleResolution": "node",
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "rootDir": "./src",
        "outDir": "./superbin"
    },
    "files": [
        "./src/index.ts"
    ]
    }

# Create the ./src/index.ts file:

    console.log("This is index.ts"); 

# Test using below commands it works:
# Build, this will create the "superbin" folder

    tsc -b  

# Run index.ts
    node -r ts-node/register/transpile-only src/index.ts

# Prepare packages folder

The next step would be to create the packages folder, where all local packages will be placed:

# This folder should be found directly under "./"
    
    mkdir packages  
    
    cd packages 

    So a short reminder:

    Each package will be placed in a subfolder inside the folder /packages.
    The monorepo config will be stored in the root (i.e "./")


# Add a local package

This guide shows how to manually create all files needed for a package. It’s also possible to use npm, see below. This section can be repeated as many times as necessary.

The package we will be creating is named ValidatorHelper (just to pick anything).

# create package folder inside of "packages"
    
    mkdir ValidatorHelper
    
    cd ValidatorHelper

# ./packages/ValidatorHelper/package.json

    Inside of the newly created folder, create a package.json as (this means you will now have two package.json, one in the monorepo root and one here):

        {
            "name": "@monorepo/validatorhelper",
            "version": "1.0.0",
            "description": "",
            "main": "bin/index.js",
            "scripts": {
                "compile": "tsc -b",
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "author": "",
            "license": "ISC"
        }

    If you prefer to decrease control, basically the same result can be achieved through:

    cd /   # Go to root of monorepo
    npm init --scope=@monorepo -w ./packages/ValidatorHelper




# This configuration will make the package build its result to ./bin with included TypeScript definitions.

    ./packages/ValidatorHelper/tsconfig.json

        {
            "compilerOptions": {
                "incremental": true,
                "target": "es2019",
                "module": "commonjs",
                "declaration": true,
                "sourceMap": true,
                "strict": true,
                "moduleResolution": "node",
                "esModuleInterop": true,
                "skipLibCheck": true,
                "forceConsistentCasingInFileNames": true,
                "rootDir": "./src",
                "outDir": "./bin",
                "composite": true
            },
        }

# Finally, create the folder src and the index.ts file.
# ./packages/ValidatorHelper/src/index.ts

    console.log("Debug: Loading ValidateHelper/index");
    export function ValidateUserName(name: string): boolean {
    return (name !== undefined && name.length > 10);
    }

# Verify package is ok

    At this point, it’s possible to check that everything seems OK.

# Change working directory
# Examine the combined tsconfig-file (this and the root one)
    cd packages/ValidatorHelper 
# Testrun the module (as-is)
    tsc --showconfig 
    node -r ts-node/register src/index.ts

Running tsc here should transpile without errors, and produce a bin folder containing two files: index.js and types.d.ts .

It’s the same files that will be produced if tsc is run at the monorepo root.


# Just check tsc succeeds without creating "bin" folder:
# Build (choose the one you prefer)
    tsc --noEmit 
    tsc -b --listEmittedFiles --diagnostics
# Test run
    tsc -b -v
    node bin\index.js


# Open the monorepo root ./tsconfig.jsonand add the references section as shown below.

    {
    "compilerOptions": {
        // leave as-is
    },
    "references": [
        {
        "path": "./packages/ValidatorHelper"
        }
    ],
    "files": [
        "./src/index.ts"
    ]
    }

# Try it:
# Transpiles packages in the order listed *and*
# then build the files referenced by "paths"cd /  # Go to root of monorepo
    
    tsc -b -v

# At this point…

At this point each local package will have:

    been built producing a ./packages/<packagename>/bin -folder
    exist as a link from node_modules/@scopename/<packagename> to ./packages/<packagename>


# NPM Packages: Add reference between local packages
     Just open ./src/index.ts and add this, and you’re good to go.

    import ValidatorHelper from '@monorepo/validatorHelper'

# Adding better references

    "dependencies": {
                "@monorepo/validatorHelper": "*" 
            }
        }

# Avoid file references?

    So npm recommends to use file references:

    npm install .\packages\ValidatorHelper -w packages\ValidatorHelper


# NPM Packages: Add an external npm package to a local package

Now, this is important, because this is different compared to how it’s usually done. To add an external npm package to a local npm package, the following procedure must be followed:

Go to the root of the monorepo and run npm to install a package in workspace by passing the -w parameter. The parameter accepts either the name of the package (in this case, @suzieq/validatorhelper) or the path (./packages/ValidatorHelper )

# Go to the root of the monorepo
# Add axios to ValidatorHelper
cd / 
npm install axios -w @monorepo/validatorhelper
npm install axios -w .\packages\ValidatorHelper


This will install axios in the monorepos node_modules , and modify the ./packages/ValidatorHelper/packages.json . Verify the success by checking that only a single node_modules folder exists at the monorepo root.


So to be super clear, do not do this (and if you manage to do it, see troubleshooting below for a fix):

cd packages\ValidatorHelper
npm install axios

# Start test for one specific or all packages

To start a npm command for all packages, just add -ws :

# Run tests for a specific package from root
    
    npm test -w @monorepo/validatorhelper

# Run tests for all local packages
    
    npm test -ws

Start tsc for one specific or all packages

# Build a specific package from root
    
    cd /
    
    tsc -b packages\ValidatorHelper

# Build all
    
    cd /
    
    tsc -b -v -w -i


# Setup data layer (Recommended typeorm )
# Getting Started

    npm i --save @nestjs/typeorm typeorm

    npm install typeorm -g

# Now let’s create and initialize a new Project

    typeorm init --name typeorm-app --database mysql
    
    cd typeorm-app

# Typeorm Configuration

We need to provide our info and custom configuration depending on our project to the typeorm to be able to connect and interact with the database properly.

So a file named ormconfig.json will be created on the root of the project that has all the configuration that typeorm needs.

    {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "",
    "database": "social_network",
    "synchronize": true,
    "logging": false,
    "migrationsTableName": "migrations",
    "entities": ["src/entity/**/*.ts"],
    "migrations": ["src/migration/**/*.ts"],
    "subscribers": ["src/subscriber/**/*.ts"],
    "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
    }


# Typeorm Entities

Entity is a class that represents a database table the filed of the class are the columns of the table, typeorm uses the help of decorators to mark the class as an entity and maps it to the database as a table with the provided fields.

Every entity has to be marked with @Entity decorator to tell typeorm that it is an entity.


        import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
        import { Tweet } from "./Tweet";

        @Entity({ name: "users" })
        export class User {
        @PrimaryGeneratedColumn("uuid")
        id: string;

        @Column()
        firstName: string;

        @Column()
        lastName: string;

        @Column({ type: "varchar" })
        age: number;
        }


        import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
        import { User } from "./User";

        @Entity({ name: "tweets" })
        export class Tweet {
        @PrimaryGeneratedColumn("uuid")
        id: string;

        @Column({ type: "varchar", length: 80 })
        title: string;

        @Column({ type: "varchar", length: 300 })
        content: string;
        }