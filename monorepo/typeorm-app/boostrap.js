import { getRepository } from "typeorm";
import { User } from "./entity/User";
import { Tweet } from "./entity/Tweet";

export const Bootstrap = async () => {
  const userRepo = getRepository(User);
  const user = userRepo.create({
    firstName: "Alex",
    lastName: "Brooks",
    age: 22,
  });
  await userRepo.save(user).catch((err) => {
    console.log("Error: ", err);
  });
  console.log("New User Saved", user);
};


export const Bootstrap = async () => {
    const userRepo = getRepository(User);
    const user = userRepo.create({
      firstName: "Alex",
      lastName: "Brooks",
      age: 22,
    });
    await userRepo.save(user).catch((err) => {
      console.log("Error: ", err);
    });
    console.log("New User Saved", user);
  
    const tweetRepo = getRepository(Tweet);
    const tweet = new Tweet();
    tweet.title = "I finally got a new Job!";
    tweet.content = "Well after a long time I landed my dream job on Netflix";
    tweet.user = user;
  
    await tweetRepo.save(tweet).catch((err) => console.log(err));
  };


  export const find = async () => {
    const userRepo = getRepository(User);
  
    const user = await userRepo
      .findOne({ where: { firstName: "Alex" } })
      .catch((err) => {
        console.log(err);
      });
  
    if (user) console.log("Tweets", await user.tweets);
  };

  const user = await getRepository(User)
    .createQueryBuilder("user")
    .innerJoin("user.tweets", "tweet")
    .where("user.firstName = :firstName", { firstName: "Alex" })
    .getOne();

    console.log("Tweets: ", user.tweets); 