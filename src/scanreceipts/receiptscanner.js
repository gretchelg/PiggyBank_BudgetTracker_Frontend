const auth = `Token ${process.env.REACT_APP_MINDEE_API_KEY}`

// parseReceipt accepts a public url and returns parsed data in MINDEE format
async function parseReceipt(imageURL){
    let mindeeResponse = {}
    try {
        mindeeResponse = await fetch(
            "https://api.mindee.net/v1/products/mindee/expense_receipts/v5/predict",
            {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: auth
                },
                body: JSON.stringify({ 
                    document: imageURL
                }),
            }
        )
    } catch(e){
        console.log("ERROR: MINDEE OCR responded with error", e)
        return 
    }
    
    const mindeeResponseBody = await mindeeResponse.json()

    return convertMindeeResponseToTransaction(mindeeResponseBody.document)
}

// convert Mindee response to Transaction schema before saving
function convertMindeeResponseToTransaction(mindeeResponse) {
    const transaction = {
        category_name: mindeeResponse.inference.prediction.category.value,
        tran_description: mindeeResponse.inference.prediction.supplier_name.value,
        tran_amount: `${mindeeResponse.inference.prediction.total_amount.value}`,
        tran_sign: "DR", //DR (expense) or CR(income)
        tran_currency: mindeeResponse.inference.prediction.locale.country,
        tran_date: mindeeResponse.inference.prediction.date.value,
    }

    return transaction
}

// Post scan receipt transaction save to DB
const saveTransaction = async (token, transaction) => {
    try {
        const res = await fetch(
            // `http://localhost:8080/transaction/`,
            `https://piggybank-api-jwhz.onrender.com/transaction/`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(transaction),
            }
        );
        if (!res.ok) {
            console.log("ERROR: Couldn't save the transction: ", res)
            return
        }
        console.log("OK: Transaction save successfully")
    } catch (error) {
        console.log("Error occured while posting the transaction ", error)
        return
    };
}

export default {
    parseReceipt: parseReceipt,
    convertMindeeResponseToTransaction: convertMindeeResponseToTransaction,
    saveTransaction: saveTransaction
}