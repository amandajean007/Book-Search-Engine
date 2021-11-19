const { Book } = require('../models');
// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // get a single user by either their id or their username
    me: async (parent, args, context) => {
        if (context.user) {
            return User.findOne({ _id: context.user_id })
              .populate('savedBooks')
              .select('-password');
        }
        throw new AuthenticationError('Cannot find a user with this id!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user }
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await User.findOneAndDelete(
          {
            _id: context.user._id,
          },
          {
            $pull: {
              savedBook: bookId,
            },
          },
          {
            new: true,
          }
        );
      return book;
      }
    throw new AuthenticationError('You need to be logged in!');
    },
    removeUser: async (parent, { userId }) => {
      return User.findOneAndUpdate(
        { _id: userId }
      );
    },
    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const book = await User.findByIdAndUpdate(
          {
            _id: context.user._id,
          },
          {
            $push: {
              savedBooks: bookData,
            },
          },
          {
            new: true,
          }
        );
        await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedBooks: book._id,
            },
          }
        );
        return book;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;
