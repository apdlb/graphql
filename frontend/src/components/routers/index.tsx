import React, { memo } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import PATHS from '../../utils/paths';
import Entities from '../pages/entities/Entities';

// import EntityContainer from '../pages/entities/entity/EntityContainer';
// import HomeContainer from '../pages/home/HomeContainer';
// import LoginContainer from '../pages/login/LoginContainer';

interface Props {}

const Routers: React.FunctionComponent<Props> = () => {
  return (
    <Router>
      <Switch>
        {/* <Route exact path={PATHS.LOGIN} children={<LoginContainer />} /> */}
        {/* <Route exact path={PATHS.HOME} children={<HomeContainer />} /> */}
        <Route exact path={PATHS.ENTITIES} children={<Entities />} />
        {/* <Route exact path={PATHS.ENTITIES_NEW} children={<EntityContainer />} />
        <Route path={PATHS.ENTITIES_ID} children={<EntityContainer />} /> */}

        <Route path="/" render={() => <Redirect to={PATHS.ENTITIES} />} />
      </Switch>
    </Router>
  );
};

export default memo(Routers);
