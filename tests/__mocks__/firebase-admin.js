// tests/__mocks__/firebase-admin.js
const getMock = jest.fn();
const setMock = jest.fn();
const updateMock = jest.fn();
const docMock = jest.fn();
const collectionMock = jest.fn();
const whereMock = jest.fn();
const orderByMock = jest.fn();
const limitMock = jest.fn();

const doc = jest.fn(() => ({
  collection: collection,
  get: getMock,
  set: setMock,
  update: updateMock,
  doc: doc, // For nested doc().doc()
}));

const collection = jest.fn(() => ({
  doc: doc,
  collection: collection, // For nested collection().collection()
  where: whereMock.mockReturnThis(),
  orderBy: orderByMock.mockReturnThis(),
  limit: limitMock.mockReturnThis(),
  get: getMock,
}));

const firestoreMock = jest.fn(() => ({
  collection: collection,
}));

const admin = {
  apps: [{}], // Simulate that Firebase has been initialized
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  firestore: firestoreMock,
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-id' }),
    getUser: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
  })),
};

admin.firestore.FieldValue = {
  serverTimestamp: jest.fn(),
  increment: jest.fn((n) => n),
};

admin.firestore.Timestamp = {
  now: jest.fn(() => ({
    toDate: jest.fn(() => new Date()),
  })),
};

admin.auth = jest.fn(() => ({
    verifyIdToken: jest.fn().mockResolvedValue({ uid: 'test-user-id' }),
    getUser: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
  }));
  

module.exports = admin;
