package com.xavidop.alexa.utilities;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class LogUtilities {

	private Logger logger;

	public LogUtilities() {
		logger = LogManager.getLogger(LogUtilities.class);
	}

	public void log(String toLog) {

		logger.info(toLog);

	}

}
