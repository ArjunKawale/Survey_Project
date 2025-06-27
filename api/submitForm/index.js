const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const { v4: uuidv4 } = require("uuid");

module.exports = async function (context, req) {
  context.log("📥 Function triggered");
  context.log("➡️ Request body:", req.body);

  const account = process.env.STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.STORAGE_ACCOUNT_KEY;
  const tableName = "SurveyResponse";

  context.log("🔐 Env - STORAGE_ACCOUNT_NAME:", account);
  context.log("🔐 Env - STORAGE_ACCOUNT_KEY exists:", !!accountKey);

  const credential = new AzureNamedKeyCredential(account, accountKey);
  const client = new TableClient(`https://${account}.table.core.windows.net`, tableName, credential);

  const entity = {
    partitionKey: "survey",
    rowKey: uuidv4(),
    name: req.body.name,
    email: req.body.email,
    field: req.body.field,
    politics: req.body.politics,
    globalEvent: req.body.globalEvent,
    sciFi: req.body.sciFi,
  };

  try {
    context.log("📝 Inserting entity:", entity);
    await client.createEntity(entity);
    context.res = {
      status: 200,
      body: "Survey submitted!"
    };
  } catch (err) {
    context.log.error("❌ Error storing entity:", err);
    context.res = {
      status: 500,
      body: "Server error: " + err.message
    };
  }
};
