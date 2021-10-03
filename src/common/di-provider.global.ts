import { DIContainer } from 'injectable-js';

export class DiProviderGlobal {
	private static instance: DIContainer;
	static get get() {
		if (!this.instance) this.instance = new DIContainer();
		return this.instance;
	}
}

DIContainer.defaultProvider = DiProviderGlobal
