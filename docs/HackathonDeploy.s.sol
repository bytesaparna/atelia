// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {console} from "lib/forge-std/src/console.sol";
import {Strings} from "lib/openzeppelin-contracts/contracts/utils/Strings.sol";

import {BaseScript} from "../Base.s.sol";

import {AppContract} from "src/app/app-contract-andromeda/Contract.sol";
import {IAppContract} from "src/app/app-contract-andromeda/IContract.sol";
import {Cw721Contract} from "src/non-fungible-token/cw721/Cw721Contract.sol";
import {IAuctionContract} from "src/non-fungible-token/auction/IContract.sol";
import {Cw20Contract} from "src/fungible-token/cw20/Contract.sol";
import {ICw20Contract} from "src/fungible-token/cw20/IContract.sol";
import {SplitterContract} from "src/finance/splitter/Contract.sol";
import {ISplitterContract} from "src/finance/splitter/IContract.sol";
import {AuctionContract} from "src/non-fungible-token/auction/Contract.sol";
import {IAuctionContract} from "src/non-fungible-token/auction/IContract.sol";
import {ExchangeContract} from "src/finance/exchange/Contract.sol";
import {IExchangeContract} from "src/finance/exchange/IContract.sol";
import {IKernelContract} from "src/os/kernel/IContract.sol";
import {IVfsContract} from "src/os/vfs/IContract.sol";
import {SplitterContractStorage} from "src/finance/splitter/Storage.sol";

import {AmpMsgLib} from "src/std/common/AmpMsg.sol";
import {AssetLib} from "src/std/common/Asset.lib.sol";
import {RecipientLib} from "src/std/common/Recipient.lib.sol";
import {ScheduleLib} from "src/std/common/Schedule.lib.sol";

contract AdoDbPublish is BaseScript {
    using Strings for address;

    address internal kernel_address = vm.envAddress("KERNEL_ADDRESS");
    address internal vfs_address = vm.envAddress("VFS_ADDRESS");

    address internal designer =
        address(0x57DBE86C7F6d1E047C992a6b923B95C5c4e561AC);

    string internal app_name = "somnia-hack-design-seven";
    string internal token_uri = "/design-seven";
    string internal native = "stt";

    uint256 internal shares_supply = 100000_000_000_000_000_000_000;

    address internal app_contract;

    function get_app_path(
        string memory component
    ) public view returns (string memory) {
        return
            string.concat(
                "/home/",
                owner.toHexString(),
                "/",
                app_name,
                "/",
                component
            );
    }

    function run() external {
        init();
        startOwnerBroadcast();

        IKernelContract.BatchMessage[]
            memory messages = new IKernelContract.BatchMessage[](6);
        messages[0] = setup_app();
        messages[1] = _mint_tokens();
        messages[2] = _approve_nft_to_auction();
        messages[3] = _start_auction();
        messages[4] = _approve_shares_to_exchange();
        messages[5] = _start_exchange();

        IKernelContract(kernel_address).batch_messages(messages);

        app_contract = IVfsContract(vfs_address).resolve_path(
            string.concat("/home/", owner.toHexString(), "/", app_name)
        );

        vm.stopBroadcast();
    }

    function setup_app()
        public
        view
        returns (IKernelContract.BatchMessage memory)
    {
        IAppContract.AppComponentParam[]
            memory _components = new IAppContract.AppComponentParam[](6);
        _components[0] = setup_tokens();
        _components[1] = setup_shares();
        _components[2] = setup_buy_exchange();
        _components[5] = setup_splitter();
        _components[3] = setup_auction();
        _components[4] = setup_redeem_exchange();
        _components[5] = setup_splitter();

        IKernelContract.BatchMessage memory message = IKernelContract
            .BatchMessage({
                message_type: IKernelContract.BatchMessageType.INSTANTIATE_ADO,
                data: abi.encode(
                    IKernelContract.BatchInstantiateAdoParams({
                        params: IKernelContract.InstantiateAdoParam({
                            ado_type: "app-contract@0.1.0"
                        }),
                        instantiate_msg: abi.encodeWithSelector(
                            AppContract.initialize.selector,
                            IAppContract.AppContractInitParams({
                                owner: owner,
                                app_name: app_name,
                                components: _components
                            })
                        )
                    })
                )
            });

        return message;
    }

    function setup_tokens()
        public
        view
        returns (IAppContract.AppComponentParam memory component)
    {
        component = IAppContract.AppComponentParam({
            name: "tokens",
            ado_type: "cw721@0.1.0",
            instantiate_msg: abi.encodeWithSelector(
                Cw721Contract.initialize.selector,
                Cw721Contract.Cw721InitParams({
                    minter: owner,
                    name: "Dressrosa",
                    symbol: "DRESSROSA",
                    owner: owner
                })
            )
        });
    }

    function setup_auction()
        public
        view
        returns (IAppContract.AppComponentParam memory component)
    {
        component = IAppContract.AppComponentParam({
            name: "auction",
            ado_type: "auction@0.1.0",
            instantiate_msg: abi.encodeWithSelector(
                AuctionContract.initialize.selector,
                IAuctionContract.AuctionContractInitParams({
                    owner: owner,
                    token_address: get_app_path("tokens")
                })
            )
        });
    }

    function setup_shares()
        public
        view
        returns (IAppContract.AppComponentParam memory component)
    {
        ICw20Contract.InitialBalance[]
            memory initialBalances = new ICw20Contract.InitialBalance[](1);
        initialBalances[0] = ICw20Contract.InitialBalance({
            account: owner,
            amount: shares_supply
        });
        component = IAppContract.AppComponentParam({
            name: "shares",
            ado_type: "cw20@0.1.0",
            instantiate_msg: abi.encodeWithSelector(
                Cw20Contract.initialize.selector,
                ICw20Contract.Cw20ContractInitParams({
                    owner: owner,
                    name: "DressrosaShares",
                    symbol: "DRSSHS",
                    decimals: 18,
                    minter: ICw20Contract.Minter({
                        minter: owner.toHexString(),
                        cap: 0
                    }),
                    initialBalances: initialBalances
                })
            )
        });
    }

    function setup_buy_exchange()
        public
        view
        returns (IAppContract.AppComponentParam memory component)
    {
        component = IAppContract.AppComponentParam({
            name: "buy-shares",
            ado_type: "exchange@0.1.0",
            instantiate_msg: abi.encodeWithSelector(
                ExchangeContract.initialize.selector,
                IExchangeContract.ExchangeContractInitParams({
                    owner: owner,
                    from_asset: AssetLib.Asset({native: native, smart: ""}),
                    to_asset: AssetLib.Asset({
                        native: "",
                        smart: get_app_path("shares")
                    }),
                    recipient: RecipientLib.Recipient({
                        recipient: get_app_path("splitter"),
                        message: ""
                    }),
                    exchange_rate_bps: 10000,
                    schedule: ScheduleLib.Schedule({
                        start: ScheduleLib.Expiry({
                            from_now: 0,
                            at_time: 0,
                            infinite: false
                        }),
                        end: ScheduleLib.Expiry({
                            from_now: 15 minutes * 1000,
                            at_time: 0,
                            infinite: false
                        })
                    })
                })
            )
        });
    }

    function setup_splitter()
        public
        view
        returns (IAppContract.AppComponentParam memory component)
    {
        SplitterContractStorage.SplitterConfig[]
            memory config = new SplitterContractStorage.SplitterConfig[](2);
        config[0] = SplitterContractStorage.SplitterConfig({
            recipient: RecipientLib.Recipient({
                recipient: designer.toHexString(),
                message: ""
            }),
            split_bps: 8000
        });
        config[1] = SplitterContractStorage.SplitterConfig({
            recipient: RecipientLib.Recipient({
                recipient: owner.toHexString(),
                message: ""
            }),
            split_bps: 2000
        });
        component = IAppContract.AppComponentParam({
            name: "splitter",
            ado_type: "splitter@0.1.0",
            instantiate_msg: abi.encodeWithSelector(
                SplitterContract.initialize.selector,
                ISplitterContract.SplitterContractInitParams({
                    owner: owner,
                    default_recipient: RecipientLib.Recipient({
                        recipient: owner.toHexString(),
                        message: ""
                    }),
                    config: config
                })
            )
        });
    }

    function setup_redeem_exchange()
        public
        view
        returns (IAppContract.AppComponentParam memory component)
    {
        component = IAppContract.AppComponentParam({
            name: "redeem-shares",
            ado_type: "exchange@0.1.0",
            instantiate_msg: abi.encodeWithSelector(
                ExchangeContract.initialize.selector,
                IExchangeContract.ExchangeContractInitParams({
                    owner: owner,
                    from_asset: AssetLib.Asset({
                        native: "",
                        smart: get_app_path("shares")
                    }),
                    to_asset: AssetLib.Asset({native: native, smart: ""}),
                    recipient: RecipientLib.Recipient({
                        recipient: owner.toHexString(),
                        message: ""
                    }),
                    exchange_rate_bps: 10000,
                    schedule: ScheduleLib.Schedule({
                        start: ScheduleLib.Expiry({
                            from_now: 30 minutes * 1000,
                            at_time: 0,
                            infinite: false
                        }),
                        end: ScheduleLib.Expiry({
                            from_now: 0,
                            at_time: 0,
                            infinite: true
                        })
                    })
                })
            )
        });
    }

    function _mint_tokens()
        public
        view
        returns (IKernelContract.BatchMessage memory)
    {
        bytes4 mintSelector = bytes4(keccak256("mint(address,uint256,string)"));
        IKernelContract.BatchMessage memory message = IKernelContract
            .BatchMessage({
                message_type: IKernelContract.BatchMessageType.EXECUTE_ADO,
                data: abi.encode(
                    IKernelContract.BatchExecuteAdoParams({
                        amp_msg: AmpMsgLib.AmpMsg({
                            recipient: get_app_path("tokens"),
                            message: abi.encodeWithSelector(
                                mintSelector,
                                owner,
                                0,
                                token_uri
                            ),
                            funds: 0,
                            config: AmpMsgLib.AmpMsgConfig({
                                exit_at_error: true
                            })
                        })
                    })
                )
            });
        return message;
    }

    function _approve_nft_to_auction()
        public
        view
        returns (IKernelContract.BatchMessage memory)
    {
        IKernelContract.BatchMessage memory message = IKernelContract
            .BatchMessage({
                message_type: IKernelContract.BatchMessageType.EXECUTE_ADO,
                data: abi.encode(
                    IKernelContract.BatchExecuteAdoParams({
                        amp_msg: AmpMsgLib.AmpMsg({
                            recipient: get_app_path("tokens"),
                            message: abi.encodeWithSelector(
                                Cw721Contract.approve.selector,
                                get_app_path("auction"),
                                0
                            ),
                            funds: 0,
                            config: AmpMsgLib.AmpMsgConfig({
                                exit_at_error: true
                            })
                        })
                    })
                )
            });
        return message;
    }

    function _start_auction()
        public
        view
        returns (IKernelContract.BatchMessage memory)
    {
        bytes4 addFundsSelector = bytes4(
            keccak256("add_funds(IExchangeContract.DynamicExchangeRate)")
        );
        SplitterContractStorage.SplitterConfig[]
            memory config = new SplitterContractStorage.SplitterConfig[](2);
        config[0] = SplitterContractStorage.SplitterConfig({
            recipient: RecipientLib.Recipient({
                recipient: owner.toHexString(),
                message: ""
            }),
            split_bps: 500
        });
        config[1] = SplitterContractStorage.SplitterConfig({
            recipient: RecipientLib.Recipient({
                recipient: get_app_path("redeem-shares"),
                message: abi.encodeWithSelector(
                    addFundsSelector,
                    IExchangeContract.DynamicExchangeRate({
                        max_inflow_amount: shares_supply
                    })
                )
            }),
            split_bps: 9500
        });
        bytes4 splitterSelector = bytes4(
            keccak256("send(SplitterContractStorage.SplitterConfig[])")
        );
        IKernelContract.BatchMessage memory message = IKernelContract
            .BatchMessage({
                message_type: IKernelContract.BatchMessageType.EXECUTE_ADO,
                data: abi.encode(
                    IKernelContract.BatchExecuteAdoParams({
                        amp_msg: AmpMsgLib.AmpMsg({
                            recipient: get_app_path("auction"),
                            message: abi.encodeWithSelector(
                                AuctionContract.start_auction.selector,
                                IAuctionContract.StartAuctionParams({
                                    token_id: 0,
                                    min_bid: 1000,
                                    min_raise: 100,
                                    schedule: ScheduleLib.Schedule({
                                        start: ScheduleLib.Expiry({
                                            from_now: 15 minutes * 1000,
                                            at_time: 0,
                                            infinite: false
                                        }),
                                        end: ScheduleLib.Expiry({
                                            from_now: 30 minutes * 1000,
                                            at_time: 0,
                                            infinite: false
                                        })
                                    }),
                                    recipient: RecipientLib.Recipient({
                                        recipient: get_app_path("splitter"),
                                        message: abi.encodeWithSelector(
                                            splitterSelector,
                                            config
                                        )
                                    }),
                                    bid_asset: AssetLib.Asset({
                                        native: native,
                                        smart: ""
                                    }),
                                    buy_now_price: 1000000000000000000
                                })
                            ),
                            funds: 0,
                            config: AmpMsgLib.AmpMsgConfig({
                                exit_at_error: true
                            })
                        })
                    })
                )
            });
        return message;
    }

    function _approve_shares_to_exchange()
        public
        view
        returns (IKernelContract.BatchMessage memory)
    {
        IKernelContract.BatchMessage memory message = IKernelContract
            .BatchMessage({
                message_type: IKernelContract.BatchMessageType.EXECUTE_ADO,
                data: abi.encode(
                    IKernelContract.BatchExecuteAdoParams({
                        amp_msg: AmpMsgLib.AmpMsg({
                            recipient: get_app_path("shares"),
                            message: abi.encodeWithSelector(
                                ICw20Contract.approve.selector,
                                get_app_path("buy-shares"),
                                shares_supply
                            ),
                            funds: 0,
                            config: AmpMsgLib.AmpMsgConfig({
                                exit_at_error: true
                            })
                        })
                    })
                )
            });
        return message;
    }

    function _start_exchange()
        public
        view
        returns (IKernelContract.BatchMessage memory)
    {
        bytes4 addFundsSelector = bytes4(keccak256("add_funds(uint256)"));
        IKernelContract.BatchMessage memory message = IKernelContract
            .BatchMessage({
                message_type: IKernelContract.BatchMessageType.EXECUTE_ADO,
                data: abi.encode(
                    IKernelContract.BatchExecuteAdoParams({
                        amp_msg: AmpMsgLib.AmpMsg({
                            recipient: get_app_path("buy-shares"),
                            message: abi.encodeWithSelector(
                                addFundsSelector,
                                shares_supply
                            ),
                            funds: 0,
                            config: AmpMsgLib.AmpMsgConfig({
                                exit_at_error: true
                            })
                        })
                    })
                )
            });
        return message;
    }
}
