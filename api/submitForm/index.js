const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const { v4: uuidv4 } = require("uuid");

module.exports = async function (context, req) {
  context.log("Function triggered: submitForm");

  const data = req.body;
  context.log("Received data:", data);

  if (!data || !data.name || !data.email) {
    context.log("❌ Invalid or incomplete form data");
    context.res = {
      status: 400,
      body: "Missing required fields"
    };
    return;
  }

  const account = process.env.STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.STORAGE_ACCOUNT_KEY;
  const tableName = "SurveyResponse";

  context.log("Using account:", account);
  context.log("Target table:", tableName);

  try {
    const credential = new AzureNamedKeyCredential(account, accountKey);
    const client = new TableClient(
      `https://${account}.table.core.windows.net`,
      tableName,
      credential
    );

    const entity = {
      partitionKey: "survey",
      rowKey: uuidv4(),
      name: data.name,
      email: data.email,
      field: data.field,
      politics: data.politics,
      globalEvent: data.globalEvent,
      sciFi: data.sciFi
    };

    context.log("Entity to store:", entity);
    await client.createEntity(entity);
    context.log("✅ Entity created successfully");

    context.res = {
      status: 200,
      body: "Survey submitted!"
    };
  } catch (err) {
    context.log("❌ Error inserting entity:", err.message);
    context.res = {
      status: 500,
      body: "Server error: " + err.message
    };
  }
};
