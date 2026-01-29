import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const secrityMiddleware = async(req,res,next)=>{
  try {
    const role =req.user?.role||'guest';
    let limit;
    let message;

    switch(role){
      case 'admin':
        limit=20;
        message='Admin request limit exceeded. slow down';
        break;
      case 'user':
        limit=10;
        message='User request limit exceeded. slow down';
        break;
      case 'guest':
        limit=5;
        message='Guest request limit exceeded. slow down';
        break;
    }
    const client =aj.withRule(slidingWindow({mode:'LIVE',interval:'1m',max:limit,name:`${role}-rate-limit`}));
    const decision=await client.protect(req);

    if(decision.isDenied()&& decision.reason.isBot()){
      logger.warn('Bot request blocked',{ip:req.ip,userAgent:req.get('User-Agent'),path:req.path});
      return res.status(403).json({error:'Forbidden',message:'Automated requests are not allowed'});

    }

    if(decision.isDenied()&& decision.reason.isShield()){
      logger.warn('shield request blocked',{ip:req.ip,userAgent:req.get('User-Agent'),path:req.path,method:req.method});
      return res.status(403).json({error:'Forbidden',message:'REquest blocked by security shield'});

    }

    if(decision.isDenied()&& decision.reason.isRateLimit()){
      logger.warn('rate limit exceeded',{ip:req.ip,userAgent:req.get('User-Agent'),path:req.path});
      return res.status(403).json({error:'Forbidden',message:'Too many requests. '});

    }

    next();
  }catch(err){
    console.error('Arcjet middleware error:',err);
    res.status(500).json({error:'Internalserver error',message:'Something went wrong with security middleware'});

  }
};
export default secrityMiddleware;
