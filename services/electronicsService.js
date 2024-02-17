const Electronics = require('../models/Electronics');
const User = require('../models/User');

exports.getOne = (electronicsId) => {
    return Electronics.findById(electronicsId);
}

exports.getOneDetailed = (electronicsId) => {
    return Electronics.findById(electronicsId).populate('owner').populate('buyingList');
};

exports.getAll = () => {
    return Electronics.find();
};


exports.create = async (userId, electronicsData) => {
    const createdElectronics = await Electronics.create({
        owner: userId,
        ...electronicsData,
    });

    await User.findByIdAndUpdate(userId, {$push: { createdElectronics: createdElectronics._id }});

    return createdElectronics;
};

exports.buy = async (electronicsId, userId) => {
    // await Course.findByIdAndUpdate(courseId, {$push: {signUpList: userId}}); // should also work
    // await User.findByIdAndUpdate(userId, {$push: {signedUpList: courseId}});

    const electronics = await Electronics.findById(electronicsId);
    const user = await User.findById(userId);

    electronics.buyingList.push(userId);
    user.boughtElectronics.push(electronicsId);

    await electronics.save();
    await user.save();
};

exports.edit = (electronicsId, electronicsData) => {
    return Electronics.findByIdAndUpdate(electronicsId, electronicsData, { runValidators: true });
}

exports.delete = (electronicsId) => {
    return Electronics.findByIdAndDelete(electronicsId);
};

// Search
exports.search = (name, type) => {
    let query = {};

    if (name) {    
        query.name = new RegExp(name, 'i');
    }

    if (type) {
        query.type = new RegExp(type, 'i');
    }
    
    return Electronics.find(query);
};