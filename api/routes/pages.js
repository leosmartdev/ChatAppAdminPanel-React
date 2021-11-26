const express = require('express');
const router = express.Router();
const Page = require('../models/Page');

router.get('/legal-agreements', async (req, res) => {
  const privacy = await Page.findOne({ slug: 'privacy-policy' });
  const agreement = await Page.findOne({ slug: 'user-agreement' });

  if (!privacy) {
    const page = new Page({
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: ''
    });
    await page.save();
  }

  if (!agreement) {
    const page = new Page({
      title: 'User Agreement',
      slug: 'user-agreement',
      content: ''
    });
    await page.save();
  }

  res.json({
    success: true,
    pages: {
      privacy: privacy?privacy.content:"",
      agreement: agreement?agreement.content:""
    }
  });
});

router.put('/privacy-policy', async (req, res) => {
  const privacy = await Page.findOneAndUpdate({ slug: 'privacy-policy' }, { content: req.body.content });

  if (!privacy) {
    const page = new Page({
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: req.body.content
    });
    await page.save();
  }

  res.json({
    success: true,
    message: 'Policy updated.'
  });
});

router.get('/privacy-policy', async (req, res) => {
  const privacy = await Page.findOne({ slug: 'privacy-policy' });

  if (!privacy) {
    const page = new Page({
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: ''
    });
    await page.save();
  }

  const content = privacy?privacy.content:"";
  res.json({
    success: true,
    content
  });
});

router.put('/user-agreement', async (req, res) => {
  const userAgreement = await Page.findOneAndUpdate({ slug: 'user-agreement' }, { content: req.body.content });

  if (!userAgreement) {
    const page = new Page({
      title: 'User Agreement',
      slug: 'user-agreement',
      content: req.body.content
    });
    await page.save();
  }

  res.json({
    success: true,
    message: 'User agreement updated.'
  });
});

router.get('/user-agreement', async (req, res) => {
  const agreement = await Page.findOne({ slug: 'user-agreement' });

  if (!agreement) {
    const page = new Page({
      title: 'User Agreement',
      slug: 'user-agreement',
      content: ''
    });
    await page.save();
  }

  const content = agreement?agreement.content:"";
  res.json({
    success: true,
    content
  });
});

module.exports = router;
