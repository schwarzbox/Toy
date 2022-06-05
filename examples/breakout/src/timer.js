// timer.js
'use strict'

const Easy = {
    linear(elapsed,st,diff,time) {
        return diff*elapsed/time+st;
    },
    inQuad(elapsed,st,diff,time) {
        const elap = elapsed/time;
        return diff*elap*elap+st;
    },
    outQuad(elapsed,st,diff,time) {
        const elap = elapsed/time;
        return -diff*elap*(elap-2)+st;
    },
    inOutQuad(elapsed,st,diff,time) {
        const elap = elapsed/time*2;
        if (elap < 1) {
            return diff/2*elap*elap+st;
        } else {
            return -diff/2*((elap-1)*(elap-3)-1)+ st;
        }
    },
    outInQuad(elapsed,st,diff,time) {
        if (elapsed < time/2) {
          return Easy.outQuad(elapsed*2, st, diff/2, time);
        } else {
          return Easy.inQuad((elapsed*2)-time, st+diff/2, diff/2, time);
        }
    },
    inCubic(elapsed,st,diff,time) {
        const elap = elapsed/time;
        return diff*(elap*elap*elap)+st;
    },
    outCubic(elapsed,st,diff,time) {
        const elap = elapsed/time-1;
        return diff*((elap*elap*elap)+1)+st;
    },
    outInCubic(elapsed,st,diff,time) {
        if (elapsed < time/2) {
            return Easy.outCubic(elapsed*2, st, diff/2, time);
        }
        else {
            return Easy.inCubic((elapsed*2)-time, st+diff/2, diff/2, time);
        }
    },
    inExpo(elapsed,st,diff,time) {
        if (elapsed===0) {
            return st;
        } else {
            return diff*Math.pow(2, 10*(elapsed/time-1))+st-diff*0.001;
        }
    },
    outExpo(elapsed,st,diff,time) {
        if (elapsed===time) {
            return st+diff;
        } else {
            return diff*1.001*(-Math.pow(2, -10*elapsed/time)+1)+st;
        }
    },
    inOutExpo(elapsed,st,diff,time) {
        if (elapsed===0) {
            return st;
        }
        if (elapsed===time) {
            return st+diff;
        }
        const elap = elapsed/time*2;
        if (elap<1) {
            return diff/2*Math.pow(2, 10*(elap-1))+st-diff * 0.0005;
        } else {
            return diff/2*1.0005*(-Math.pow(2, -10*(elap-1))+2)+ st;
        }
    },
    outInExpo(elapsed,st,diff,time) {
        if (elapsed<time/2) {
            return Easy.outExpo(elapsed*2, st, diff/2, time);
        } else {
            return Easy.inExpo((elapsed*2)-time, st+diff/2, diff/2, time)
        }
    },
    inBack(elapsed,st,diff,time,step) {
        const elap = elapsed / time;
        return diff*elap*elap*((step+1)*elap-step)+st;
    },
    outBack(elapsed,st,diff,time,step) {
        const elap = elapsed/time-1;
        return diff*(elap*elap*((step+1)*elap+step)+1)+st;
    },
    inOutBack(elapsed,st,diff,time,step) {
        let elap = elapsed/time*2;
        if (elap<1) {
            return diff/2*(elap*elap*((step+1)*elap-step*1.525))+st;
        } else {
            elap -= 2
            return diff/2*(elap*elap*((step+1)*elap+step*1.525)+2)+st;
        }
    },
    outInBack(elapsed,st,diff,time,step) {
        if (elapsed<time/2) {
            return Easy.outBack(elapsed*2, st, diff/2, time, step);
        } else {
            return Easy.inBack((elapsed*2)-time, st+diff/2,diff/2,time,step);
        }
    },
    inBounce(elapsed,st,diff,time) {
        return diff-Easy.outBounce(time-elapsed, 0, diff, time)+st;
    },
    outBounce(elapsed,st,diff,time) {
        let elap = elapsed/time;
        if (elap<1/2.75) {
            return diff*(7.5625*elap*elap) + st;
        } else if (elap < 2 / 2.75) {
            elap = elap - (1.5 / 2.75);
            return diff*(7.5625*elap*elap+0.75) + st;
        } else if (elap<2.5/2.75) {
            elap = elap-(2.25/2.75);
            return diff*(7.5625*elap * elap + 0.9375) + st;
        } else {
            elap = elap-(2.625/2.75);
            return diff*(7.5625*elap*elap+0.984375) + st;
        }
    },
    inOutBounce(elapsed,st,diff,time) {
        if (elapsed<time/2) {
            return Easy.inBounce(elapsed*2,0,diff,time)*0.5+st;
        } else {
            return Easy.outBounce(elapsed*2-time,0,diff,time)*0.5+diff*0.5+st;
        }
    },
    outInBounce(elapsed,st,diff,time) {
        if (elapsed<time/2) {
            return Easy.outBounce(elapsed*2, st, diff/2, time);
        } else {
            return Easy.inBounce((elapsed*2)-time, st+diff/2, diff/2, time);
        }
    }
}

class Timer {
    constructor(tag) {
        this.tag = tag;
    }

    stop(tiker) {
        tiker.stop()
        tiker.destroy();
    }

    after(time, func) {
        const tiker = new GG.Ticker();
        tiker.delay = time;
        tiker.start();
        tiker.add(() => {
            tiker.delay -= tiker.deltaMS;
            if (tiker.delay < 0) {
                func();
                this.stop(tiker);
            }
        });
        return tiker;
    }

    // stop manually
    every(time, func) {
        const tiker = new GG.Ticker();
        tiker.delay = time;
        tiker.start();
        tiker.add(() => {
            tiker.delay -= tiker.deltaMS;
            if (tiker.delay < 0) {
                func();
                tiker.delay = time;
            }
        });
        return tiker;
    }

    during(time, func) {
        const tiker = new GG.Ticker();
        tiker.delay = time;
        tiker.start();
        tiker.add(() => {
            func();
            tiker.delay -= tiker.deltaMS;
            if (tiker.delay < 0) {
                this.stop(tiker);
            }
        });
        return tiker;
    }

    tween(
        time,
        ctx,
        keys,
        goals,
        func=Easy.linear,
        after=() => {},
        step=2.70158
    ) {
        const tiker = new GG.Ticker();
        let elapsed = 0;
        let tweens = {};
        for (let i in keys) {
            tweens[keys[i]] = {
                start: ctx[keys[i]],
                diff: goals[i] - ctx[keys[i]],
            };
        }
        tiker.start();
        tiker.add(() => {
            elapsed += tiker.deltaMS;
            for (let i in keys) {
                ctx[keys[i]] = func(
                    elapsed, tweens[keys[i]].start,
                    tweens[keys[i]].diff, time, step
                );
            }
            if (elapsed >= time) {
                after();
                this.stop(tiker);
            }
        });
        return tiker;
    }
}

console.log('[Import -> Timer, Easy]')
