function LbasRightManager(userRights) {
	this.userRights = userRights;
	LbasRightManager.prototype.checkRight = function(keyOfRight) {
		if (this.userRights && this.userRights != null) {

			if (this.userRights.user_role ==1 || this.userRights[keyOfRight]) {
				return true;
			}
		}
		return false;
	};

	LbasRightManager.prototype.isCompanyAdmin = function() {
		if (this.userRights.user_role == 1) {
			return true;
		} else {
			return false;
		}
	};

}