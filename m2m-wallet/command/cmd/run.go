package cmd

import (
	"context"
	"github.com/pkg/errors"
	"mxprotocol-server/m2m-wallet/db"
	"mxprotocol-server/m2m-wallet/pkg/api"
	"mxprotocol-server/m2m-wallet/pkg/services/withdraw"
	"os"
	"os/signal"
	"syscall"

	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"

	"mxprotocol-server/m2m-wallet/pkg/config"
)

func run(cmd *cobra.Command, args []string) error {
	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()

	tasks := []func() error{
		setLogLevel,
		printStartMessage,
		setupDb,
		//setupAuth,
		setupWithdraw,
		//setupwallet,
		//setupTopUp,
		setupAPI,
	}

	for _, t := range tasks {
		if err := t(); err != nil {
			log.Fatal(err)
		}
	}

	sigChan := make(chan os.Signal)
	exitChan := make(chan struct{})
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)
	log.WithField("signal", <-sigChan).Info("signal received")
	go func() {
		log.Warning("stopping mxp-server")
		exitChan <- struct{}{}
	}()
	select {
	case <-exitChan:
	case s := <-sigChan:
		log.WithField("signal", s).Info("signal received, stopping immediately")
	}

	return nil
}

func setLogLevel() error {
	log.SetLevel(log.Level(uint8(config.Cstruct.General.LogLevel)))
	return nil
}

func printStartMessage() error {
	log.WithFields(log.Fields{
		"version": version,
	}).Info("starting mxp-server")
	return nil
}

func setupDb() error {
	if err := db.Setup(config.Cstruct); err != nil {
		return errors.Wrap(err, "setup db error")
	}
	return nil
}

func setupWithdraw() error {
	if err := withdraw.Setup(); err != nil {
		return errors.Wrap(err, "setup service withdraw error")
	}
	return nil
}

func setupAPI() error {
	if err := api.Setup(config.Cstruct); err != nil {
		return errors.Wrap(err, "setup api error")
	}
	return nil
}