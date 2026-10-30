'use client';
import {useEffect,useState} from 'react';
import {onValue,ref} from 'firebase/database';
import {db} from '@/lib/firebase';
import {type CountryCode,WAAS_REGIONS,type WaasPackage} from '@/data/waas-pricing';
export const pricingPath=(country:CountryCode)=>'content/waasPricing/'+country;
type PricingState={country:CountryCode;packages:WaasPackage[];loaded:boolean;error:string|null};
function defaults(country:CountryCode):WaasPackage[]{
  return WAAS_REGIONS[country].packages.map(p=>({...p,features:[...p.features]}));
}
export function useWaasPricing(country:CountryCode){
  const [state,setState]=useState<PricingState>(()=>({country,packages:defaults(country),loaded:false,error:null}));
  useEffect(()=>{
    setState({country,packages:defaults(country),loaded:false,error:null});
    const unsubscribe=onValue(ref(db,pricingPath(country)),snapshot=>{
      const stored=snapshot.val()?.packages;
      const packages=defaults(country).map((base,i)=>{
        const override=Array.isArray(stored)?stored[i]:undefined;
        if(!override||typeof override!=='object'||Array.isArray(override))return base;
        return {...base,...override,features:Array.isArray(override.features)?override.features.filter((x:unknown):x is string=>typeof x==='string'):base.features} as WaasPackage;
      });
      setState({country,packages,loaded:true,error:null});
    },err=>setState({country,packages:defaults(country),loaded:true,error:err.message||'Unable to load editable prices.'}));
    return unsubscribe;
  },[country]);
  return state.country===country?state:{country,packages:defaults(country),loaded:false,error:null};
}