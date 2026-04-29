require("dotenv").config();
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const createApiRouter = require("./routes/api.routes");
const buildSwaggerSpec = require("./docs/api-docs");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

const swaggerSpec = buildSwaggerSpec({
  serverUrl: `http://localhost:${PORT}`,
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
  "/api",
  createApiRouter({
    excelPath: path.join(__dirname, "../../Data/Demandes_Patients.xlsx"),
    confirmedPath: path.join(__dirname, "../../Data/RendezVous_Confirmes.xlsx"),
  }),
);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
