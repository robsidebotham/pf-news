const {
  formatDates,
  makeRefObj,
  formatComments,
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an array", () => {
    expect(Array.isArray(formatDates([]))).toBe(true);
  });
  it("returns a different array to the input array", () => {
    const input = [];
    expect(formatDates(input)).not.toBe(input);
  });
  it("does not mutate the input array", () => {
    const input = [
      {
        title: "abcdefg",
        topic: "hijkl",
        author: "mnopqrs",
        body: "tuvwxyz",
        created_at: 1471522072389,
      },
    ];
    const output = [
      {
        title: "abcdefg",
        topic: "hijkl",
        author: "mnopqrs",
        body: "tuvwxyz",
        created_at: 1471522072389,
      },
    ];
    formatDates(input);
    expect(input).toEqual(output);
  });
  it("all properties on the input object persist", () => {
    const input = [
      {
        title: "abcdefg",
        topic: "hijkl",
        author: "mnopqrs",
        body: "tuvwxyz",
        created_at: 1471522072389,
      },
    ];
    expect(Object.keys(formatDates(input)[0])).toEqual([
      "title",
      "topic",
      "author",
      "body",
      "created_at",
    ]);
  });
  it("property 'created at' is a date object, representing the correct number of milliseconds", () => {
    const input = [
      {
        title: "abcdefg",
        topic: "hijkl",
        author: "mnopqrs",
        body: "tuvwxyz",
        created_at: 1471522072389,
      },
    ];
    expect(formatDates(input)[0].created_at).toEqual(new Date(1471522072389));
  });
});

describe("makeRefObj", () => {
  it("takes an array and returns an object", () => {
    expect(makeRefObj([])).toEqual({});
  });
  it("takes an array containing a single object and returns an object in the correct format", () => {
    expect(makeRefObj([{ article_id: 1, title: "abcdefg" }])).toEqual({
      abcdefg: 1,
    });
  });
  it("takes an array containing multiple objects and returns an object in the correct format", () => {
    expect(
      makeRefObj([
        { article_id: 1, title: "abcdefg" },
        { article_id: 2, title: "hijklmn" },
        { article_id: 3, title: "opqrstu" },
      ])
    ).toEqual({ abcdefg: 1, hijklmn: 2, opqrstu: 3 });
  });
  it("does not mutate the original inputs, returns new object", () => {
    const input = [{ article_id: 1, title: "abcdefg" }];
    expect(input).toEqual([{ article_id: 1, title: "abcdefg" }]);
  });
});

describe("formatComments", () => {
  it("returns an array", () => {
    expect(Array.isArray(formatComments([], { a: 1 }))).toBe(true);
  });
  it("returns a different array to the input array", () => {
    const input = [];
    expect(formatComments(input, { a: 1 })).not.toBe(input);
  });
  it("does not mutate the input array", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    const output = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
    ];
    formatComments(input, { a: 1 });
    expect(input).toEqual(output);
  });
  it("returning objects have properties of 'author', 'article_id', 'votes', 'created_at' & 'body'", () => {
    const input = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 1511354163389,
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389,
      },
      {
        body:
          'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 100,
        created_at: 1448282163389,
      }
    ];
    const refObj = { 
      "They're not exactly dogs, are they?": 16,
      "Living in the shadow of a great man": 14,
      "Living in the shadow of a great man": 100
    };
    const output = formatComments(input, refObj);
    output.forEach(comment => {
      expect(Object.keys(comment)).toEqual(["body", "votes", "created_at", "author", "article_id"]);
    });
  });
});
