var mysql = require('promise-mysql')

//joinLetters bliver brugt til at give tables et navn, så fx hvis der skal laves et join på tabellen "Opgave" kan den hedde Opgave c og den vil tilgå opgaveId med c.opgaveId osv
//det er mest fordi der ikke er nogen nem måde at lave index fra loopet om til et bogstav og mysql kan ikke lide at man bruger tal i stedet for bogstaver (altså 1.opgaveId)...
//man kunne lave en metode der laver tal om til bogstaver, men det her er meget bedre for performance og det sjældent man laver så mange joins...
var joinLetters = ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z']
var config = require('./mysqlConfig.js').config

var conn;

function initConnection() {
    try {
        conn = mysql.createPool(config)
        console.log('mysql connection started')
    }
    catch (error) {
        throw error
    }
}

// function closeConnection() {

// }

/**
 * Returnere en column string ved at sætte ',' mellem alle strings i columnArray (og sletter det sidste da det ellers ville være en forkert syntax)
 * fx opgaveId,opgaveNavn,kundeId osv
 * @param {string[]} columnArray Navnet på columns der skal bruges
 */
function setupColumnsString(columnArray) {
    let query = ''

    for (let i = 0; i < columnArray.length; i++) {
        query += columnArray[i] + ','
    }
    query = query.slice(0, -1)

    return query
}

/**
 * Bruges til syntax for left join da der skal tilføjes navn til tabellerne og columns, se forklaringen ved "joinLetters" i toppen af mysqlhandler.js
 * Returnere columns med navn
 * @param {string[]} columnArray De columns der skal laves left join på
 * @param {string} columnLetter Det bogstav der skal bruges (kunne også være et navn for mere overskuelige queries)
 * @param {string} columnString Hvis der skal bygges videre på en streng tilføjes den her
 */
function setupColumnsStringWithLetterForJoin(columnArray, columnLetter, columnString) {
    let query = columnString

    for (let i = 0; i < columnArray.length; i++) {
        query += columnLetter + '.' + columnArray[i] + ','
    }
    query = query.slice(0, -1)

    return query
}

/**
 * Ændre værdierne i valueArray så de passer til mysql syntax
 * Parser tal så de får fjernet "" rundt om sig, ellers er det en string for mysql
 * Sætter "null" til null, ellers er det en string med værdi "null" for mysql
 * @param {var[]} valueArray Værdierne der skal bruges i querien
 */
function setupValuesArray(valueArray) {
    for (let i = 0; i < valueArray.length; i++)
        if (!isNaN(valueArray[i]) && valueArray[i] != "" && valueArray[i] != undefined)//is a number
            valueArray[i] = parseInt(valueArray[i], 10)
        else if (valueArray[i] == "null" || valueArray[i] == "")//if null
            valueArray[i] = null
}

/**
 * Inserter en til mange rows i databasen
 * Funktionen er rekursiv
 * @param {JSON} arg arg skal indeholde objektet data der kommer fra funktioner såsom "saveData" i modulerne (se fx modulet opgave.js)
 * @param {number} createdDoneIndex Da funktionen er rekursiv er dette tal indexet den er kommet til (kald altid med 0 første gang)
 * @param {number} firstId Id på første insert, bruges til fx at oprette en opgave og derefter insert deadlines, opgaveId (som deadlines skal bruges) kendes ikke før opgave er blevet insertet
 * @param {Object[]} earlierResults Resultater fra tidligere kald da funktionen er rekursiv
 * @param {Function} callback callback function til når funktionen er færdig
 * @param {Function} errorCallback callback function til når der sker en fejl
 */
async function createInDB(arg, createdDoneIndex, firstId, earlierResults, callback, errorCallback) {
    try {
        console.log('create in db')
        //console.log(arg.data)
        let results = { data: [], origin: arg.origin, type: 'create' }
        if (earlierResults != undefined)
            results = earlierResults

        let insertId = firstId;

        let data = arg.data[createdDoneIndex]


        var tableName = data.table
        var columns = setupColumnsString(data.columns)

        for (let i = 0; i < data.values.length; i++)
            setupValuesArray(data.values[i])

        // console.log(arg.data[0].values[0], 'setupvalues')
        if (data.useIdFromFirstInsert) {
            for (let i = 0; i < data.values.length; i++) {
                data.values[i].push(insertId)
            }
        }

        console.log(data)
        let duplicateKey = ''
        if (data.onDupliateKeyUpdate) {
            duplicateKey = 'ON DUPLICATE KEY UPDATE ' + data.onDupliateKeyUpdate.column + ' = values(' + data.onDupliateKeyUpdate.column + ')'
            //duplicateKey += createDuplicateKeyString()
        }

        // console.log(arg.data[0].values[0],'sql string')
        var sql = "INSERT INTO " + tableName + " (" + columns + ") VALUES ? " + duplicateKey;
        console.log(sql)

        await conn.query(sql, [data.values])
            .then(function (result) {
                
                if (tableName == arg.idFromFirstInsert)
                    insertId = result.insertId

                results.data.push({ result: result, fields: { orgTable: tableName } })

                if (results.data.length == arg.data.length)
                    callback(Object.assign(arg, results))
                else
                    createInDB(arg, createdDoneIndex + 1, insertId, results, callback, errorCallback)
            })
            .catch(function (error) {
                throw error
            })
    }
    catch (error) {
        errorCallback(Object.assign(arg, { error }))
    }
}


/**
 * Select fra databasen, henter data fra databasen
 * @param {JSON} arg arg skal indeholde objektet data der kommer fra funktioner såsom "getData" i modulerne (se fx modulet opgave.js)
 * @param {Function} callback callback function til når funktionen er færdig
 * @param {Function} errorCallback callback function til når der sker en fejl
 */
async function readFromDB(arg, callback, errorCallback) {
    try {
        console.log('readfromdb')
        let results = { data: [], origin: arg.origin, type: 'read' }

        for (let i = 0, l = arg.data.length; i < l; i++) {
            let data = arg.data[i]

            var tableName = data.table
            var columns = setupColumnsStringWithLetterForJoin(data.columns, 'a', '')
            var leftjoin = ''

            if (data.leftJoins) {
                for (let i = 0, l = data.leftJoins.length; i < l; i++) {
                    let leftJoinData = data.leftJoins[i];

                    columns += ','
                    columns = setupColumnsStringWithLetterForJoin(leftJoinData.selectColumns, joinLetters[i], columns)

                    let leftTableLetter = 'a'
                    //find ud af hvilket bogstav lefttable har ved at køre dem igennem
                    for (let i = 0, l = data.leftJoins.length; i < l; i++) {
                        if (leftJoinData.leftTable == data.leftJoins[i].rightTable) {
                            leftTableLetter = joinLetters[i]
                            break;
                        }
                    }

                    leftjoin += ' LEFT JOIN ' + leftJoinData.rightTable + ' ' + joinLetters[i] + ' ON ' + leftTableLetter + '.' + leftJoinData.leftColumn + ' = ' + joinLetters[i] + '.' + leftJoinData.rightColumn
                }
            }
            let whereValues = ''
            if (data.where) {
                whereValues = setupWhereString(data.where)
            }

            let betweenValues = ''
            if (data.between) {
                if (whereValues == '')
                    betweenValues = ' WHERE '
                else
                    betweenValues = ' AND '

                for (let i = 0; i < data.between.length; i++)
                    betweenValues += data.between[i].column + ' BETWEEN ' + data.between[i].start + ' AND ' + data.between[i].slut + ' AND '
                betweenValues = betweenValues.slice(0, -5)
            }

            var sql = "SELECT " + columns + " FROM " + tableName + " a" + leftjoin + whereValues + betweenValues;
            console.log(sql)

            await conn.query(sql)
                .then(function (result) {
                    results.data.push({ result: result, fields: { orgTable: tableName } })
                    if (results.data.length == arg.data.length)
                        callback(Object.assign(arg, results))
                    //callback(results)
                })
                .catch(function (error) {
                    throw error
                })
        }
    }
    catch (error) {
        errorCallback(Object.assign(arg, { error }))
    }
}

/**
 * Returnere en sql streng til Update der følger syntaxen "column1 = value1, column2 = value2" osv
 * @param {string[]} columnArray indeholder de columns der skal opdateres
 * @param {string[]} valueArray indeholder de værdier der skal bruges
 */
function setupSetString(columnArray, valueArray) {
    let query = ''
    //col = val, col = val
    for (let i = 0; i < columnArray.length; i++) {
        query += columnArray[i] + '='

        if (isNaN(valueArray[i]))
            query += '"' + valueArray[i] + '"'
        else
            query += valueArray[i]

        query += ','

    }
    query = query.slice(0, -1)

    return query
}

/**
 * Returnere en string til når man skal lave en WHERE i mysql, mulighed for at bygge flere krav på
 * @param {Object[]} whereArray Indeholder objekter med column og value
 */
function setupWhereString(whereArray) {
    let query = ''
    if (whereArray.length > 0)
        query += ' WHERE '
    //WHERE column = value AND id = 2
    for (let i = 0; i < whereArray.length; i++) {
        query += whereArray[i].column + '='

        if (isNaN(whereArray[i].value))
            query += '"' + whereArray[i].value + '"'
        else
            query += whereArray[i].value

        query += ' AND '
    }
    query = query.slice(0, -5)

    return query
}

/**
 * Opdater en til mange rows i databasen
 * @param {JSON} arg arg skal indeholde objektet data der kommer fra funktioner såsom "updateOpgave" i modulerne (se fx modulet opgave.js)
 * @param {Function} callback callback function til når funktionen er færdig
 * @param {Function} errorCallback callback function til når der sker en fejl
 */
async function updateInDB(arg, callback, errorCallback) {
    try {
        console.log('updateInDB')
        let results = { data: [], origin: arg.origin, type: 'update' }

        for (let i = 0, l = arg.data.length; i < l; i++) {
            let data = arg.data[i]

            let tableName = data.table
            let setValues = setupSetString(data.columns, data.values)

            let whereValues = setupWhereString(data.where)

            let sql = "UPDATE " + tableName + " SET " + setValues + whereValues
            console.log(sql)
            await conn.query(sql)
                .then(function (result) {
                    results.data.push({ result: result, fields: { orgTable: tableName } })
                    if(results.data.length == arg.data.length)
                        callback(Object.assign(arg, results))
                })
                .catch(function (error) {
                    throw error
                })
        }
    }
    catch (error) {
        errorCallback(Object.assign(arg, { error }))
    }
}

/**
 * Sletter en til mange rows i databasen
 * @param {JSON} arg arg skal indeholde objektet data der kommer fra funktioner såsom "deleteOpgave" i modulerne (se fx modulet opgave.js)
 * @param {Function} callback callback function til når funktionen er færdig
 * @param {Function} errorCallback callback function til når der sker en fejl
 */
async function deleteInDB(arg, callback, errorCallback) {
    try {
        console.log('deleteInDB')
        let results = { data: [], origin: arg.origin, type: 'delete' }

        for (let i = 0, l = arg.data.length; i < l; i++) {
            let data = arg.data[i]
            let tableName = data.table
            let whereValues = setupWhereString(data.where)

            let sql = "DELETE FROM " + tableName + whereValues
            console.log(sql)
            await conn.query(sql)
                .then(function (result) {
                    results.data.push({ result: result, fields: { orgTable: tableName } })
                    callback(Object.assign(arg, results))
                    //callback(results)
                })
                .catch(function (error) {
                    throw error
                })
        }
    }
    catch (error) {
        errorCallback(Object.assign(arg, { error }))
    }


}

module.exports = {
    initConnection: initConnection,
    createInDB: createInDB,
    readFromDB: readFromDB,
    updateInDB: updateInDB,
    deleteInDB: deleteInDB,
}