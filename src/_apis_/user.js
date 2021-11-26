import { random, sample } from 'lodash';
// utils
import mock from './mock';
import mockData from '../utils/mock-data';

// ----------------------------------------------------------------------

mock.onGet('/api/user/profile').reply(() => {
  const profile = {
    id: mockData.id(1),
    cover: mockData.image.cover(1),
    position: 'UI Designer',
    follower: random(99999),
    following: random(99999),
    quote: 'Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer..',
    country: mockData.address.country(1),
    email: mockData.email(1),
    company: mockData.company(1),
    school: mockData.company(2),
    role: 'Manager',
    facebookLink: `https://www.facebook.com/caitlyn.kerluke`,
    instagramLink: `https://www.instagram.com/caitlyn.kerluke`,
    linkedinLink: `https://www.linkedin.com/in/caitlyn.kerluke`,
    twitterLink: `https://www.twitter.com/caitlyn.kerluke`
  };

  return [200, { profile }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/all').reply(() => {
  const users = [...Array(24)].map((_, index) => ({
    id: mockData.id(index),
    avatarUrl: mockData.image.avatar(index),
    cover: mockData.image.cover(index),
    name: mockData.name.fullName(index),
    follower: random(9999),
    following: random(9999),
    totalPost: random(9999),
    position: mockData.role(index)
  }));

  return [200, { users }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/manage-users').reply(() => {
  const users = [...Array(24)].map((_, index) => ({
    id: mockData.id(index),
    avatarUrl: mockData.image.avatar(index),
    name: mockData.name.fullName(index),
    email: mockData.email(index),
    phoneNumber: mockData.phoneNumber(index),
    address: '908 Jack Locks',
    country: mockData.address.country(index),
    state: 'Virginia',
    city: 'Rancho Cordova',
    zipCode: '85807',
    company: mockData.company(index),
    isVerified: mockData.boolean(index),
    status: sample(['active', 'banned']) || 'active',
    role: mockData.role(index)
  }));

  return [200, { users }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/social/followers').reply(() => {
  const followers = [...Array(18)].map((_, index) => ({
    id: mockData.id(index),
    avatarUrl: mockData.image.avatar(index),
    name: mockData.name.fullName(index),
    country: mockData.address.country(index),
    isFollowed: mockData.boolean(index)
  }));

  return [200, { followers }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/social/friends').reply(() => {
  const friends = [...Array(18)].map((_, index) => ({
    id: mockData.id(index),
    avatarUrl: mockData.image.avatar(index),
    name: mockData.name.fullName(index),
    role: mockData.role(index)
  }));

  return [200, { friends }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/social/gallery').reply(() => {
  const gallery = [...Array(18)].map((_, index) => ({
    id: mockData.id(index),
    title: mockData.text.title(index),
    postAt: mockData.time(index),
    imageUrl: mockData.image.cover(index)
  }));

  return [200, { gallery }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/account/cards').reply(() => {
  const cards = [...Array(2)].map((_, index) => ({
    id: mockData.id(index),
    cardNumber:
      (index === 0 && '**** **** **** 1234') || (index === 1 && '**** **** **** 5678') || '**** **** **** 5678',
    cardType: (index === 0 && 'master_card') || (index === 1 && 'visa') || 'master_card'
  }));

  return [200, { cards }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/account/address-book').reply(() => {
  const addressBook = [...Array(4)].map((_, index) => ({
    id: mockData.id(index),
    name: mockData.name.fullName(index),
    phone: mockData.phoneNumber(index),
    country: mockData.address.country(index),
    state: 'New Hampshire',
    city: 'East Sambury',
    street: '41256 Kamille Turnpike',
    zipCode: '85807'
  }));

  return [200, { addressBook }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/account/invoices').reply(() => {
  const invoices = [...Array(10)].map((_, index) => ({
    id: mockData.id(index),
    createdAt: mockData.time(index),
    price: mockData.number.price(index)
  }));

  return [200, { invoices }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/account/notifications-settings').reply(() => {
  const notifications = {
    activityComments: true,
    activityAnswers: true,
    activityFollows: false,
    applicationNews: true,
    applicationProduct: false,
    applicationBlog: false
  };

  return [200, { notifications }];
});

// ----------------------------------------------------------------------

mock.onGet('/api/user/posts').reply(() => {
  const posts = [...Array(3)].map((_, index) => ({
    id: mockData.id(index),
    author: {
      id: mockData.id(8),
      avatarUrl: mockData.image.avatar(1),
      name: 'Caitlyn Kerluke'
    },
    isLiked: true,
    createdAt: mockData.time(index),
    media: mockData.image.feed(index),
    message: mockData.text.sentence(index),
    personLikes: [...Array(36)].map((_, index) => ({
      name: mockData.name.fullName(index),
      avatarUrl: mockData.image.avatar(index + 2)
    })),
    comments: (index === 2 && []) || [
      {
        id: mockData.id(7),
        author: {
          id: mockData.id(8),
          avatarUrl: mockData.image.avatar(sample([2, 3, 4, 5, 6]) || 2),
          name: mockData.name.fullName(index + 5)
        },
        createdAt: mockData.time(2),
        message: 'Praesent venenatis metus at'
      },
      {
        id: mockData.id(9),
        author: {
          id: mockData.id(10),
          avatarUrl: mockData.image.avatar(sample([7, 8, 9, 10, 11]) || 7),
          name: mockData.name.fullName(index + 6)
        },
        createdAt: mockData.time(3),
        message:
          'Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus.'
      }
    ]
  }));

  return [200, { posts }];
});
