const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");
const { v4: uuidv4 } = require("uuid");

module.exports = async function (context, req) {
  const data = req.body;

  const account = process.env.STORAGE_ACCOUNT_NAME;
  const accountKey = process.env.STORAGE_ACCOUNT_KEY;
  const tableName = "SurveyResponse";

  const credential = new AzureNamedKeyCredential(account, accountKey);
  const client = new TableClient(`https://${account}.table.core.windows.net`, tableName, credential);

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

  try {
    await client.createEntity(entity);
    context.res = {
      status: 200,
      body: "Survey submitted!"
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: "Error: " + err.message
    };
  }
};
