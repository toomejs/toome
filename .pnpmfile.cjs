module.exports = {
    hooks: {
        readPackage(pkg) {
            if (pkg.name === 'react-loadingg') {
                pkg.peerDependencies = {};
            }
            return pkg;
        },
    },
};
