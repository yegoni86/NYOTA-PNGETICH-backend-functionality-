const express = require("express");
const cors = require("cors");
const path = require("path");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// STK Push
app.post("/stk-push", async (req, res) => {
  try {
    const { phone, amount } = req.body;

    const response = await fetch(
      "https://api.paylorke.com/api/v1/merchants/payments/stk-push",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.PAYLOR_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone,
          amount: Number(amount),
          reference: "NYOTA-" + Date.now(),
          channelId: process.env.PAYLOR_CHANNEL_ID,
          description: "NYOTA Funds Payment",
          callbackUrl: process.env.CALLBACK_URL
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: data.message || "STK Push failed."
      });
    }

    res.json({
      success: true,
      transactionId: data.transactionId,
      data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to send STK Push."
    });
  }
});

// Payment Status
app.post("/payment-status", async (req, res) => {
  try {
    const { transactionId } = req.body;

    const response = await fetch(
      `https://api.paylorke.com/api/v1/merchants/payments/transactions/${transactionId}`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.PAYLOR_API_KEY}`
        }
      }
    );

    const data = await response.json();

    res.json({
      success: true,
      data: {
        status: data.status,
        reference: data.reference
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to check payment status."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
