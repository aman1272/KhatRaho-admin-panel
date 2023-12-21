import React from 'react';
import { Helmet } from 'react-helmet';


function WithBootstrap(Component) {
    return function WithCSS(props) {
        return (
            <>
                 <Helmet>
                    <link rel="stylesheet" href="css/feather.css" />
                    <link rel="stylesheet" href="css/mdi/css/materialdesignicons.min.css" />
                    <link rel="stylesheet" href="css/ti-icons/css/themify-icons.css" />
                    <link rel="stylesheet" href="css/typicons/typicons.css" />
                    <link rel="stylesheet" href="css/simple-line-icons.css" />
                    <link rel="stylesheet" href="css/vendor.bundle.base.css" />
                    <link rel="stylesheet" href="css/select.dataTables.min.css" />
                    <link rel="stylesheet" href="css/style.css" />
                    </Helmet>
                <Component {...props} />
            </>
        );
    };
}

export default WithBootstrap;