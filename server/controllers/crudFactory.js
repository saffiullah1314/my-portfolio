exports.getAll = (Model) => async (req, res, next) => {
  try {
    let query;
    if (req.user) {
      query = Model.find().sort({ order: 1, createdAt: -1 });
    } else {
      // If the model has a visible field, filter by it for public requests
      if (Model.schema.path('visible')) {
        query = Model.find({ visible: true }).sort({ order: 1, createdAt: -1 });
      } else {
        query = Model.find().sort({ order: 1, createdAt: -1 });
      }
    }

    const docs = await query;
    res.status(200).json({ success: true, count: docs.length, data: docs });
  } catch (err) {
    next(err);
  }
};

exports.getOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

exports.createOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }
    res.status(200).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
