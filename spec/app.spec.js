process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection"); //invokes the connection by passing dbConfig into knex()

beforeEach(() => connection.seed.run());
afterAll(() => connection.destroy());

describe("REQUESTS", () => {
  describe("/api", () => {
    it("GET: (Status 200) returns an array of objects containing endpoint details.", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.endpoints)).toBe(true);
          body.endpoints.forEach((endpoint) => {
            expect(Object.keys(endpoint)).toEqual(
              expect.arrayContaining(["method", "path", "description"])
            );
          });
        });
    });
    describe("/topics", () => {
      it("GET: (Status 200) returns an array of 'topic' objects.", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.topics)).toBe(true);
            body.topics.forEach((topic) => {
              expect(Object.keys(topic)).toEqual(
                expect.arrayContaining(["description", "slug"])
              );
            });
          });
      });
      it("GET: (Status 200) returns all topics contained within the database.", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics.length).toBe(3);
          });
      });
    });
    describe("/users/:username", () => {
      it("GET: (Status 200) returns an object containing a single 'user' object.", () => {
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body.user)).toEqual(
              expect.arrayContaining(["username", "avatar_url", "name"])
            );
          });
      });
      it("GET: (Status 200) returns the details of the specified user.", () => {
        const testUser = {
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        };
        return request(app)
          .get("/api/users/icellusedkars")
          .expect(200)
          .then(({ body }) => {
            expect(body.user).toEqual(testUser);
          });
      });
    });
    describe("/articles", () => {
      it("GET: (Status 200) returns an array of 'articles' objects.", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.articles)).toBe(true);
            body.articles.forEach((article) => {
              expect(Object.keys(article)).toEqual(
                expect.arrayContaining([
                  "author",
                  "title",
                  "article_id",
                  "topic",
                  "created_at",
                  "votes",
                  "comment_count",
                ])
              );
            });
          });
      });
      it("GET: (Status 200) returns all articles contained within the database.", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(12);
          });
      });
      it("GET: (Status 200) each article object has a counter representing the total count of all the comments for that article.", () => {
        const counts = ["13", "0", "0", "0", "2", "1", "0", "0", "2", "0", "0", "0"];
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach((article, index) => {
              expect(article.comment_count).toBe(counts[index]);
            });
          });
      });
      it("GET: (Status 200) articles can be returned sorted by 'author' (descending).", () => {
        return request(app)
          .get("/api/articles?sort_by=author")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("author", { descending: true });
          });
      });
      it("GET: (Status 200) articles can be returned sorted by 'title' (descending).", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("title", { descending: true });
          });
      });
      it("GET: (Status 200) articles can be returned sorted by 'article_id' (descending).", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("article_id", {
              descending: true,
            });
          });
      });
      it("GET: (Status 200) articles can be returned sorted by 'topic' (descending).", () => {
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("topic", { descending: true });
          });
      });
      it("GET: (Status 200) articles can be returned sorted by 'votes' (descending).", () => {
        return request(app)
          .get("/api/articles?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("votes", { descending: true });
          });
      });
      it.skip("GET: (Status 200) articles can be returned sorted by 'comment_count' (descending).", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("comment_count", {
              descending: true,
            });
          });
      });
      it("GET: (Status 200) by default, articles are returned sorted by 'created_at' (descending).", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      it("GET: (Status 200) articles can be returned sorted by 'author' (ascending).", () => {
        return request(app)
          .get("/api/articles?sort_by=author&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("author");
          });
      });
      it("GET: (Status 200) articles can be returned sorted by 'title' (ascending).", () => {
        return request(app)
          .get("/api/articles?sort_by=title&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("title");
          });
      });
      it("GET: (Status 200) articles can be returned sorted by 'article_id' (ascending).", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("article_id");
          });
      });
      it("GET: (Status 200) articles can be returned sorted by 'topic' (ascending).", () => {
        return request(app)
          .get("/api/articles?sort_by=topic&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("topic");
          });
      });
      it("GET: (Status 200) articles can be returned sorted by 'votes' (ascending).", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("votes");
          });
      });
      it.skip("GET: (Status 200) articles can be returned sorted by 'comment_count' (ascending).", () => {
        return request(app)
          .get("/api/articles?sort_by=comment_count&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("comment_count");
          });
      });
      it("GET: (Status 200) articles can be returned sorted by 'created_at' (ascending).", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy("created_at");
          });
      });
      it("GET: (Status 200) returned articles can be filtered by author.", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach((article) => {
              expect(article.author).toBe("butter_bridge");
            });
          });
      });
      it("GET: (Status 200) returned articles can be filtered by topic.", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
            });
          });
      });
      it("GET: (Status 200) returns an empty array if no articles exist for a specified author.", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(0);
        });
      });
      it("GET: (Status 200) returns an empty array if no articles exist for a specified topic.", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles.length).toBe(0);
        });
      });
    });
    describe("/articles/:article_id", () => {
      it("GET: (Status 200) returns an object containing a single 'article' object.", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body.article)).toEqual(
              expect.arrayContaining([
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count",
              ])
            );
          });
      });
      it("GET: (Status 200) returns the details of the specified article.", () => {
        const testArticle = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          votes: 100,
          topic: "mitch",
          author: "butter_bridge",
          created_at: "2018-11-15T12:21:54.171Z",
          comment_count: "13",
        };
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article).toEqual(testArticle);
          });
      });
      it("PATCH: (Status 200) returns an object containing a single 'article' object.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body.article)).toEqual(
              expect.arrayContaining([
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
              ])
            );
          });
      });
      it("PATCH: (Status 200) number of votes can be incremented by a specified value.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).toBe(110);
          });
      });
      it("PATCH: (Status 200) number of votes can be decremented by a specified value.", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).toBe(90);
          });
      });
    });
    describe("/articles/:article_id/comments", () => {
      it("GET: (Status 200) returns an array of 'comment' objects for the specified article.", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.comments)).toBe(true);
            body.comments.forEach((comment) => {
              expect(Object.keys(comment)).toEqual(
                expect.arrayContaining([
                  "comment_id",
                  "author",
                  "votes",
                  "created_at",
                  "body",
                ])
              );
            });
          });
      });
      it("GET: (Status 200) returns all comments contained within the database, for the specified article.", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(13);
          });
      });
      it("GET: (Status 200) comments can be returned sorted by 'comment_id' (descending).", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=comment_id")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("comment_id", {
              descending: true,
            });
          });
      });
      it("GET: (Status 200) comments can be returned sorted by 'votes' (descending).", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("votes", { descending: true });
          });
      });
      it("GET: (Status 200) comments can be returned sorted by 'author' (descending).", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=author")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("author", { descending: true });
          });
      });
      it.skip("GET: (Status 200) comments can be returned sorted by 'body' (descending).", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=body")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("body", { descending: true });
          });
      });
      it("GET: (Status 200) by default, comments are returned sorted by 'created_at' (descending).", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("created_at", {
              descending: true,
            });
          });
      });
      it("GET: (Status 200) comments can be returned sorted by 'comment_id' (ascending).", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=comment_id&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("comment_id");
          });
      });
      it("GET: (Status 200) comments can be returned sorted by 'votes' (ascending).", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=votes&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("votes");
          });
      });
      it("GET: (Status 200) comments can be returned sorted by 'author' (ascending).", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=author&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("author");
          });
      });
      it.skip("GET: (Status 200) comments can be returned sorted by 'body' (ascending).", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=body&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("body");
          });
      });
      it("GET: (Status 200) comments can be returned sorted by 'created_at' (ascending).", () => {
        return request(app)
          .get("/api/articles/1/comments?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy("created_at");
          });
      });
      it("GET: (Status 200) returns an empty array when an article exists but has no comments.", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(0);
        });
      });
      it("POST: (Status 201) returns an object containing a single 'comment' object.", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "butter_bridge",
            body: "totally bored of gardening",
          })
          .expect(201)
          .then(({ body }) => {
            expect(Object.keys(body.comment)).toEqual(
              expect.arrayContaining([
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body",
              ])
            );
          });
      });
      it("POST: (Status 201) returns the details of the posted comment.", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({
            username: "butter_bridge",
            body: "totally bored of gardening",
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment.comment_id).toBe(19);
            expect(body.comment.author).toBe("butter_bridge");
            expect(body.comment.article_id).toBe(1);
            expect(body.comment.votes).toBe(0);
            expect(body.comment.body).toBe("totally bored of gardening");
          });
      });
    });
    describe("/comments", () => {
      it("GET: (Status 200) returns an array of 'comment' objects.", () => {
        return request(app)
          .get("/api/comments")
          .expect(200)
          .then(({ body }) => {
            expect(Array.isArray(body.comments)).toBe(true);
            body.comments.forEach((comment) => {
              expect(Object.keys(comment)).toEqual(
                expect.arrayContaining([
                  "comment_id",
                  "author",
                  "article_id",
                  "votes",
                  "created_at",
                  "body",
                ])
              );
            });
          });
      });
      it("GET: (Status 200) returns all comments contained within the database.", () => {
        return request(app)
          .get("/api/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments.length).toBe(18);
          });
      });
    });
    describe("/comments/:comment_id", () => {
      it("PATCH: (Status 200) returns an object containing a single 'comment' object.", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(Object.keys(body.comment)).toEqual(
              expect.arrayContaining([
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body",
              ])
            );
          });
      });
      it("PATCH: (Status 200) number of votes can be incremented by a specified value.", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).toBe(26);
          });
      });
      it("PATCH: (Status 200) number of votes can be decremented by a specified value.", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -10 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment.votes).toBe(6);
          });
      });
      it("DELETE: (Status 204) specified comment is removed from the database.", () => {
        return request(app)
          .delete("/api/comments/10")
          .expect(204)
          .then(() => {
            return request(app).get("/api/comments");
          })
          .then(({ body }) => {
            body.comments.forEach((comment) => {
              expect(comment.comment_id).not.toBe(10);
            });
          });
      });
    });
  });
});
describe("ERRORS", () => {
  describe("/", () => {
    it("GET: (Status 404) Route does not exist.", () => {
      return request(app)
        .get("/api/badendpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource Not Found");
        });
    });
  })
  describe("/api", () => {
    it("DELETE: (Status 405) Method not allowed.", () => {
      return request(app)
        .delete("/api")
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method Not Allowed");
        });
    });
  });
  describe("/api/topics", () => {
    it("PATCH: (Status 405) Method not allowed.", () => {
      return request(app)
        .patch("/api/topics")
        .send({})
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method Not Allowed");
        });
    });
  });
  describe("/api/users", () => {
    it("PATCH: (Status 405) Method not allowed.", () => {
      return request(app)
        .patch("/api/users")
        .send({})
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method Not Allowed");
        });
    });
  });
  describe("/api/users/:username", () => {
    it("GET: (Status 404) User does not exist.", () => {
      return request(app)
        .get("/api/users/notauser")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User Not Found");
        });
    });
  });
  describe("/api/articles", () => {
    it("GET: (Status 400) Bad Request - sorting by an invalid field.", () => {
      return request(app)
        .get("/api/articles?sort_by=notafield")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("GET: (Status 404) Filtering by an invalid author name.", () => {
      return request(app)
        .get("/api/articles?author=not-an-author")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User Not Found");
        });
    });
    it("GET: (Status 404) Filtering by an invalid topic slug.", () => {
      return request(app)
        .get("/api/articles?topic=not-a-topic")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic Not Found");
        });
    });
    it("PATCH: (Status 405) Method not allowed.", () => {
      return request(app)
        .patch("/api/articles")
        .send({})
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method Not Allowed");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("GET: (Status 404) Article does not exist.", () => {
      return request(app)
        .get("/api/articles/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article Not Found");
        });
    });
    it("GET: (Status 400) Bad Request - invalid article id.", () => {
      return request(app)
        .get("/api/articles/dog")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("PATCH: (Status 404) Article does not exist.", () => {
      return request(app)
        .patch("/api/articles/1000")
        .send({ inc_votes: -10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article Not Found");
        });
    });
    it("PATCH: (Status 200) Attempting to patch with nothing, returns the article unchanged.", () => {
      const testArticle = {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: "2018-11-15T12:21:54.171Z",
          votes: 100,
        }
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toEqual(testArticle);
        });
    });
    it("PATCH: (Status 400) Bad Request - invalid 'inc-votes' value.", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "dog"})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("/api/articles/:article_id/comments", () => {
    it("GET: (Status 404) Article does not exist.", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article Not Found");
        });
    });
    it("GET: (Status 400) Bad Request - sorting by an invalid field.", () => {
      return request(app)
        .get("/api/articles/1/comments?sort_by=notafield")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("POST: (Status 400) Bad Request - request does not include all of the required keys.", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "butter_bridge"
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("POST: (Status 404) Article does not exist.", () => {
      return request(app)
        .post("/api/articles/1000/comments")
        .send({ username: "butter_bridge", body: "totally bored of gardening" })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("/api/comments", () => {
    it("PATCH: (Status 405) Method not allowed.", () => {
      return request(app)
        .patch("/api/comments")
        .send({})
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe("Method Not Allowed");
        });
    });
  });
  describe("/api/comments/:comment_id", () => {
    it("PATCH: (Status 404) Comment does not exist.", () => {
      return request(app)
        .patch("/api/comments/1000")
        .send({ inc_votes: -10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment Not Found");
        });
    });
    it("PATCH: (Status 200) Attempting to patch with nothing, returns the comment unchanged.", () => {
      const testComment = {
        comment_id: 1,
        author: 'butter_bridge',
        article_id: 9,
        votes: 16,
        created_at: '2017-11-22T12:36:03.389Z',
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        }
      return request(app)
        .patch("/api/comments/1")
        .send({})
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).toEqual(testComment);
        });
    });
    it("PATCH: (Status 400) Bad Request - invalid 'inc-votes' value.", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "dog"})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
    it("PATCH: (Status 404) Comment does not exist.", () => {
      return request(app)
        .patch("/api/comments/1000")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment Not Found");
        });
    });
    it("DELETE (Status 400) Comment does not exist.", () => {
      return request(app)
      .delete("/api/comments/1000")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment Not Found");
      });
    });
  });
});
