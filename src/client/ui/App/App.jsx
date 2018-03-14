import React from "react";
import { hot } from "react-hot-loader";

import styles from "./App.css";

export const App = hot(module)
	(class App extends React.Component {
		render() {
			return <div className={styles.App}></div>
		}
	});
