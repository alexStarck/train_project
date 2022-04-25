import React from 'react'


const checkPermissions = (userPermissions, allowedPermissions) => {
    if (allowedPermissions.length === 0) {
        return true
    }

    return userPermissions.some(permission =>{
            console.log(allowedPermissions.includes(permission))
            if (allowedPermissions.includes(permission)) return true
    })
}

const AccessControl = ({
                           userPermissions,
                           allowedPermissions,
                           children,
                           renderNoAccess,
                       }) => {
    const permitted = checkPermissions(userPermissions, allowedPermissions)

    if (permitted) {
        return children;
    }
    return renderNoAccess()
};

AccessControl.defaultProps = {
    allowedPermissions: [],
    permissions: [],
    renderNoAccess: () => null,
};

export default AccessControl