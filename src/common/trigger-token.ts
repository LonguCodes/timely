import { useState } from "react";

class TriggerTokenInternal {
	private _registered = new Set<Function>();

	public register(fn:Function) {
		this._registered.add(fn);
	}

	public deregister(fn:Function) {
		if (this._registered.has(fn)) this._registered.delete(fn);
	}

	public trigger() {
		this._registered.forEach((value) => value());
	}
	
	
}

export type TriggerToken = TriggerTokenInternal;
export function useTriggerToken(){
  const [value, setValue] =  useState<TriggerToken>(new TriggerTokenInternal())
  return value;
}