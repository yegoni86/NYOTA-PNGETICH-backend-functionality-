const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* STK Push */
app.post("/stk-push", async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Phone and amount are required."
      });
    }

    // Replace this section with your Daraja or PayHero API request.
    // Example response for testing:
    return res.json({
      success: true,
      transactionId: "TEST_" + Date.now(),
      message: "STK Push request received."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
});

/* Payment Status */
app.post("/payment-status", async (req, res) => {
  try {
    const { transactionId } = req.body;

    return res.json({
      success: true,
      data: {
        transactionId,
        status: "PENDING"
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
