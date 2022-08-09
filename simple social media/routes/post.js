const router = require("express").Router();
const connection = require("../config/db");

//create a post
router.post("/create", async (req, res) => {
  console.log(req.body);
  connection.query("INSERT INTO posts SET ?", req.body, (err, result) => {
    if (err) {
      console.log("Error: ", err);
      return res.send({ msg: "error while inserting" });
    }
    res.send({ msg: "succes" });
  });
});

//get all posts
router.get("/all", async (req, res) => {
  connection.query(
    "SELECT distinct prd.*, b.body as reply, l.userId as postLikes FROM posts prd left join comment b on  b.postId = prd.postId left join likes l on b.postId = l.postId",
    (err, result) => {
      if (err) {
        console.log("Error: ", err);
        return res.send({ msg: "error while inserting" });
      }
      res.send({ psots: result });
    }
  );
});

//update a post by id
router.put("/update/:id", async (req, res) => {
  connection.query(
    `select * from posts where  postId = ${req.params.id}`,
    (err, result) => {
      if (err) {
        console.log("Error: ", err);
        return res.status(403).send({ msg: "post not found" });
      }

      if (result[0].userId === req.body.userId) {
        console.log(result[0].userId);
        connection.query(
          `UPDATE posts SET body =? where postId = ${req.params.id}`,
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

//delete a post by id

router.put("/delete/:id", async (req, res) => {
  connection.query(
    `SELECT userId from posts where postId = ${req.params.id} `,
    (err, result) => {
      if (err) {
        console.log("Error: ", err);
        return res.status(403).send({ msg: "error retrieving" });
      }

      if (result[0].userId === req.body.userId) {
        connection.query(
          `DELETE FROM posts WHERE postId = ${req.params.id}`,
          (err, result) => {
            if (err) {
              console.log("Error: ", err);
              return res.status(403).send({ msg: "error deleting" });
            }

            res.status(200).send({ msg: "success" });
          }
        );
      }
    }
  );
});

//like a post

router.post("/like", async (req, res) => {
  connection.query("INSERT INTO likes SET ?", req.body, (err, result) => {
    if (err) {
      console.log("Error: ", err);
      return res.send({ msg: "error while inserting" });
    }
    res.send({ msg: "liked" });
  });
});

module.exports = router;
