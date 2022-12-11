const express = require("express");
const searchLogModel = require("./models");
const app = express();

app.post("/add_log", async (request, response) => {
  const SearchLog = new searchLogModel(request.body);

  try {
    await SearchLog.save();
    console.log("SearchLog Saved");
    response.send(SearchLog);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/logs", async (request, response) => {
  const SearchLog = await searchLogModel.find({});

  try {
    response.send(SearchLog);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/search", async (request, response) => {
  var from = request.query.from;
  var to = request.query.to;

  console.log("from: " + from + " => to: " + to);
  // from = new Date(from);
  // to = new Date(to);

  const SearchLog = await searchLogModel.aggregate([
    {
      $match: {
        createdAt: {
          $gt: new Date(from),
          $lt: new Date(to),
        },
      },
    },
    {
      $project: {
        y: {
          $year: "$createdAt",
        },
        m: {
          $month: "$createdAt",
        },
        d: {
          $dayOfMonth: "$createdAt",
        },
        h: {
          $hour: "$createdAt",
        },
        tweet: 1,
      },
    },
    {
      $group: {
        _id: {
          year: "$y",
          month: "$m",
          day: "$d",
          hour: "$h",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
        "_id.day": 1,
        "_id.hour": 1,
      },
    },
  ]);

  try {
    response.send(SearchLog);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/count", async (request, response) => {
  var to = new Date();
  var fromDay = new Date();
  var fromHour = new Date();
  fromDay.setDate(to.getDate() - 1);
  fromHour.setDate(to.getHours() - 1);

  // console.log("from: " + from + " => to: " + to);
  // from = new Date(from);
  // to = new Date(to);

  const dayLog = await searchLogModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(fromDay),
          $lte: new Date(to),
        },
      },
    },
    {
      $count: "title",
    },
  ]);

  const hourLog = await searchLogModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(fromHour),
          $lte: new Date(to),
        },
      },
    },
    {
      $count: "title",
    },
  ]);

  try {
    response.send({ day: dayLog.length, hour: hourLog.length });
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;
