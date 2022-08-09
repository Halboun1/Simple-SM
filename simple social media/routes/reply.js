const router = require("express").Router();
const connection = require("../config/db");

router.get("/reply/all", async (req, res) => {
  connection.query("SELECT * from comment", (err, result) => {
    if (err) {
      console.log(err);
      res.send({ msg: "not found" });
    }
    res.status(200).send({ replies: result });
  });
});

router.post("/reply/create", async (req, res) => {
  connection.query("INSERT INTO comment SET ?", req.body, (err, result) => {
    if (err) {
      console.log("Error: ", err);
      return res.send({ msg: "error while inserting" });
    }
    res.send({ msg: "succes" });
  });
});

//update a reply by its id
router.put("/reply/update/:id", async (req, res) => {
  connection.query(
    `SELECT * FROM comment where id = ${req.params.id}`,
    (err, result) => {
      if (err) {
        console.log("Error: ", err);
        return res.status(403).send({ msg: "error retrieving reply" });
      }
      if (result[0].userId === req.body.userId) {
        connection.query(
          `UPDATE comment SET body =? where postId = ${req.params.id}`,
          req.body.body,
          (err, result) => {
            if (err) {
              console.log("Error: ", err);
              return res.status(403).send({ msg: "error updating" });
            }

            res.status(200).send({ msg: "success" });
          }
        );
      }
    }
  );
});

router.put("/reply/delete/:id", async (req, res) => {
  connection.query(
    `SELECT userId from comment where id = ${req.params.id} `,
    (err, result) => {
      if (err) {
        console.log("Error: ", err);
        return res.status(403).send({ msg: "error retrieving" });
      }

      if (result[0].userId === req.body.userId) {
        connection.query(
          `DELETE FROM comment WHERE id = ${req.params.id}`,
          (err, result) => {
            if (err) {
              console.log("Error: ", err);
              return res.status(403).send({ msg: "error deleting" });
            }

            return res.status(200).send({ msg: "success" });
          }
        );
      }
      res.send({ msg: "access denies" });
    }
  );
});

module.exports = router;
