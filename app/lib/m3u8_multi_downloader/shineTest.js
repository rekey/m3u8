/**
 * Intro:
 * Date:2020/6/22
 *
 * "Life is like riding a bicycle. To keep your balance, you must keep moving." - Albert Einstein
 *
 *                      。
 *      。               ~!,
 *     ~*                ~*@:
 *    !=-                ~:#@
 *   .@;~                  @#
 *    #&  ...~;=&&&&&&&=!~,
 *      ,:%%&!:~~~~~::;!*&%%@#,
 *     .@@~                  !@
 *     &@#                .~&&
 *     #@#-.          &%%@&=!   #@@~     =@#;
 *     .=@@@#&&*!!!;;:~.        @@@.     ,@
 *        -:;!!*=&%%@@@@@*     ~@@;
 *                    ,:@@#    &@@&@&* :&#@#. %%       .!%%*.
 *        -%%-          @@&   .@@!&@@!  *@@-  @@@@@@@ ,@@  @@
 *        ,&@=       ~*&#:    -@& @@=   &@*  .@@~ @@* :@@&@@@：
 *          .;=%%#&*:,..      =@  @@.   @@   ;@=  @@  ~@         *:#。
 *                            @. .@=    @-   &@   @.   @@@@@      .:*#@@@@@&*;-
 *                           ,#  #@:                                          &#~
 *                               @@:                                           *#~
 *                               *@;                              .!          *#~
 *                                @#                           .-&#@@@@@@@%%&~
 *                                 !~                        ~;!&%%.
 *
 */

const m3u8Parser = require('m3u8-parser');
const fs = require('fs');

const parser = new m3u8Parser.Parser();
parser.push(fs.readFileSync('test/v.f230.m3u8'));
parser.end();
const parsedManifest = parser.manifest;
console.log(parsedManifest.segments[0]);
